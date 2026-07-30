# G-Auth

Sign in with Google. Unlock a personal vault with a memorized image-sequence pattern
and/or an Android-style connect-the-dots grid pattern before you can reach sensitive
areas of the app.

Google handles *who you are*. The vault pattern proves *it's really you, right now, on
this device* — a second factor layered on top of the Google session, not a replacement
for it.

## Stack

Next.js 14 (App Router, TypeScript) · NextAuth v5 (Auth.js) + Google provider ·
Prisma ORM (SQLite locally, Postgres in production) · bcryptjs · jose · zod · Resend ·
Tailwind CSS.

## How the vault works

1. Sign in with Google — this is the only real account login.
2. First-time users are sent to `/onboarding/vault-setup` to configure at least one
   vault method: an ordered image-click sequence (`GRAPHICAL`) and/or a grid pattern
   (`GRID_PATTERN`, 3x3 or 4x4).
3. Sensitive routes (`/profile/**`, `/vault/**`) require both a valid Google session
   *and* a short-lived (10 minute) "vault unlocked" cookie, checked in two tiers:
   - `src/middleware.ts` (Edge): session + cookie presence/validity.
   - `src/app/profile/layout.tsx` (Node/Prisma): whether the vault is actually
     configured yet, plus a DB-backed re-check of the unlock state.
4. Three wrong pattern attempts in a row locks the vault for 5 minutes and sends a
   security-alert email to the user's Google address (via Resend; logged to the
   console instead if `RESEND_API_KEY` isn't set).
5. Google's OAuth tokens are **never persisted** — see the `linkAccount` wrapper in
   `src/lib/auth.ts`. The app only needs Google for identity, so there's nothing
   sensitive worth storing in the first place.

## Local development

```bash
npm install
cp .env.example .env.local
# fill in GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET, AUTH_SECRET, VAULT_COOKIE_SECRET
npx prisma migrate dev
npm run dev
```

`.env`'s `DATABASE_URL` defaults to a local SQLite file (`prisma/dev.db`) — no external
database needed to develop.

### Google OAuth setup

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services →
   Credentials → Create OAuth client ID (Web application).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` for dev,
   `https://<your-domain>/api/auth/callback/google` for the deployed app.
3. Copy the client ID/secret into `.env.local`.

## Database: SQLite locally, Postgres in production

Prisma requires the datasource `provider` to be a literal string, so one schema file
can't serve both engines at runtime. `config/db.config.mjs` is the single place that
decides which environment is active (`dev` → sqlite, `prod` → postgres); everything
else — the build script, `scripts/gen-prod-schema.mjs` — reads from it instead of
guessing.

- `prisma/schema.prisma` is the checked-in source of truth (`provider = "sqlite"`), so
  `git clone && npm install && npx prisma migrate dev` works with zero config.
- `prisma/schema.production.prisma` is **generated**, not hand-maintained — it's a
  build-time copy of `schema.prisma` with the provider swapped to `postgresql`. Never
  edit it directly; edit `schema.prisma` and it regenerates on the next build.
- **SQLite is dev-only.** Vercel's serverless filesystem is ephemeral, so it cannot
  serve as a production database — this is a hard platform limit, not a preference.

## Deploying to Vercel

1. Provision a Postgres database (e.g. [Neon](https://neon.tech) free tier).
2. Set these environment variables in the Vercel project (Production + Preview):
   - `DATABASE_URL` — pooled Postgres connection string
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`, `AUTH_URL` (your deployed URL)
   - `VAULT_COOKIE_SECRET` (different from `AUTH_SECRET`)
   - `RESEND_API_KEY`, `EMAIL_FROM`
3. Vercel runs `npm run build`, which:
   1. generates `prisma/schema.production.prisma` from `prisma/schema.prisma`
   2. runs `prisma generate` + `prisma db push` against Postgres
   3. runs `next build`
4. Add the production redirect URI to the Google OAuth client:
   `https://<your-domain>/api/auth/callback/google`.

`prisma db push` (not `migrate deploy`) is used against Postgres to avoid maintaining a
second, provider-specific migration history for what's a small/solo-scale project.
Swapping to `migrate deploy` with a real Postgres migration history is a one-line
change in `package.json` if this grows into a team project.
