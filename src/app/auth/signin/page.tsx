import { signIn } from '@/lib/auth';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default function SignInPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-3xl font-bold text-gold mb-2">G-Auth</h1>
      <p className="text-white/60 mb-8">Sign in to continue</p>
      <form
        action={async () => {
          'use server';
          await signIn('google', { redirectTo: '/profile' });
        }}
      >
        <GoogleSignInButton />
      </form>
    </div>
  );
}
