import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getLockoutStatus } from '@/lib/vault/lockout';
import { LockoutCountdown } from '@/components/vault/LockoutCountdown';

export default async function VaultLockedPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const lockout = await getLockoutStatus(session.user.id);
  if (!lockout.locked) {
    redirect('/vault/unlock');
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 text-center py-16">
      <h1 className="text-2xl font-semibold text-gold mb-4">Vault locked</h1>
      <p className="text-white/70 max-w-md mb-6">
        Too many failed unlock attempts. We sent a security alert to your email. You can
        try again once the timer below reaches zero.
      </p>
      <LockoutCountdown seconds={lockout.retryAfterSeconds ?? 0} />
    </div>
  );
}
