'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashSequence } from '@/lib/vault/crypto';
import { issueVaultUnlockCookie } from '@/lib/vault/cookie';
import { vaultSetupSchema } from '@/lib/validation/vault';

export interface VaultSetupState {
  ok: boolean;
  error?: string;
}

export async function saveVaultSetup(input: unknown): Promise<VaultSetupState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'Not signed in' };
  }

  const parsed = vaultSetupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }
  const { type, sequence, gridSize } = parsed.data;

  const secretHash = await hashSequence(sequence);
  const userId = session.user.id;

  await prisma.vaultCredential.upsert({
    where: { userId_type: { userId, type } },
    update: { secretHash, sequenceLen: sequence.length, gridSize: gridSize ?? null, isActive: true },
    create: { userId, type, secretHash, sequenceLen: sequence.length, gridSize: gridSize ?? null },
  });

  await issueVaultUnlockCookie(userId);

  return { ok: true };
}
