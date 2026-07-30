import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';
import { verifyVaultUnlockToken } from '@/lib/vault/token';
import { VAULT_UNLOCK_COOKIE_NAME } from '@/lib/vault/constants';

const { auth } = NextAuth(authConfig);

const UNLOCK_ROUTE_PREFIXES = ['/vault/unlock', '/vault/locked'];
const SESSION_ONLY_PATHS = ['/profile'];

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  if (UNLOCK_ROUTE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const userId = req.auth?.user?.id;
  if (!userId) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (SESSION_ONLY_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(VAULT_UNLOCK_COOKIE_NAME)?.value;
  const unlocked = await verifyVaultUnlockToken(cookie, userId);
  if (!unlocked) {
    const unlockUrl = new URL('/vault/unlock', req.url);
    unlockUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(unlockUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/profile', '/settings', '/security', '/vault-setup', '/vault/:path*'],
};
