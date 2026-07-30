import Link from 'next/link';

const FEATURES = [
  'Secure, user-friendly authentication method',
  'Resistant to brute-force attacks via lockout + alerts',
  'Adaptable for various devices and screen sizes',
  'Fully customizable patterns for individual users',
  'Layered on top of Google sign-in',
  'No plaintext secrets ever stored',
];

const HOW_IT_WORKS = [
  'Sign in with your Google account — that’s your real identity.',
  'Set up a personal vault: an ordered image sequence and/or a connect-the-dots grid pattern.',
  'Every time you return, replay your pattern to unlock sensitive areas.',
  'Get too many attempts wrong, and the vault locks itself and emails you.',
];

const METRICS = [
  { metric: 81, description: 'Percent of hacking-related breaches involving a stolen password' },
  { metric: 1265, description: 'Percent rise in malicious phishing emails since Q4 2022' },
  { metric: 54, description: 'Percent of consumers who’ve noticed phishing get more sophisticated' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="min-h-[80vh] flex flex-col justify-center items-center bg-ink text-white px-4">
        <h1 className="text-gold text-center text-4xl md:text-6xl max-w-3xl">
          A simpler, stronger verification system
        </h1>
        <p className="text-gold text-center text-xl md:text-2xl mt-4">
          Google sign-in, protected by a memory you own.
        </p>
        <Link
          href="/auth/signin"
          className="mt-8 bg-gold text-ink font-semibold px-6 py-3 rounded-md hover:opacity-90 transition"
        >
          Continue with Google
        </Link>
      </section>

      <section className="min-h-screen flex flex-col justify-center items-center bg-panel text-white px-4 py-16">
        <h2 className="text-gold text-center text-3xl md:text-5xl mb-10">Why choose G-Auth</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
          {FEATURES.map((feature) => (
            <div className="bg-ink p-6 rounded-xl shadow-md" key={feature}>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="min-h-screen flex flex-col justify-center items-center bg-ink text-white px-4 py-16">
        <h2 className="text-gold text-center text-3xl md:text-5xl mb-10">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
          {HOW_IT_WORKS.map((step, index) => (
            <div className="bg-panel p-6 rounded-xl shadow-md" key={index}>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="min-h-[70vh] flex flex-col justify-center items-center bg-panel text-white px-4 py-16 text-center">
        <h2 className="text-gold text-3xl md:text-5xl mb-6">Our philosophy</h2>
        <p className="max-w-2xl text-lg md:text-xl text-white/80">
          Security shouldn&apos;t come at the cost of usability. Google handles who you
          are; your vault pattern proves it&apos;s really you, right now, on this device
          — without asking you to remember one more password.
        </p>
      </section>

      <section className="min-h-[70vh] flex flex-col justify-center items-center bg-ink text-white px-4 py-16">
        <h2 className="text-gold text-center text-3xl md:text-5xl mb-10">Why it matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">
          {METRICS.map((m) => (
            <div className="border-[3px] border-panel p-6 rounded-xl text-center" key={m.description}>
              <p className="text-3xl text-gold">{m.metric}%</p>
              <p className="text-white/70 mt-2">{m.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
