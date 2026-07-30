import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getVaultStatus } from './status';
import type { Session } from 'next-auth';

export async function requireUnlockedVaultSession(fromPath: string): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const status = await getVaultStatus(session.user.id);
  if (!status.configured) {
    redirect('/profile');
  }
  if (!status.unlocked) {
    redirect(`/vault/unlock?from=${encodeURIComponent(fromPath)}`);
  }

  return session;
}
