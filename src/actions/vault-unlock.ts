'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { attemptVaultUnlock } from '@/lib/vault/lockout';
import { vaultUnlockSchema } from '@/lib/validation/vault';

export interface VaultUnlockState {
  success: boolean;
  locked?: boolean;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  error?: string;
}

export async function attemptUnlock(input: unknown): Promise<VaultUnlockState> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { success: false, error: 'Not signed in' };
  }

  const parsed = vaultUnlockSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const headerList = headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
  const userAgent = headerList.get('user-agent') ?? undefined;

  const result = await attemptVaultUnlock({
    userId: session.user.id,
    userEmail: session.user.email,
    method: parsed.data.type,
    sequence: parsed.data.sequence,
    ip,
    userAgent,
  });

  return result;
}
