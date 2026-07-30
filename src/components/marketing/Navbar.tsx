import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="py-4 px-6 flex justify-between items-center text-gold">
      <Link href="/" className="font-bold text-xl text-white">
        G-<span className="text-gold">Auth</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {session?.user ? (
          <>
            <Link href="/profile" className="hover:text-white transition">
              Profile
            </Link>
            <Link href="/security" className="hover:text-white transition">
              Security
            </Link>
            <Link href="/settings" className="hover:text-white transition">
              Settings
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button type="submit" className="hover:text-white transition">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link href="/auth/signin" className="hover:text-white transition">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
