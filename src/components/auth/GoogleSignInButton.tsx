'use client';

import { useFormStatus } from 'react-dom';

export function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="flex items-center gap-3 bg-white text-ink font-medium px-6 py-3 rounded-md hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Redirecting to Google…' : 'Continue with Google'}
    </button>
  );
}
