'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { clearVaultUnlockCookie } from '@/lib/vault/cookie';
import { vaultResetSchema } from '@/lib/validation/vault';

export interface VaultResetState {
  ok: boolean;
  error?: string;
}

export async function resetVault(input: unknown): Promise<VaultResetState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'Not signed in' };
  }

  const parsed = vaultResetSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid input' };
  }
  const userId = session.user.id;

  await prisma.vaultCredential.deleteMany({ where: { userId, type: parsed.data.type } });
  if (parsed.data.type === 'GRAPHICAL') {
    await prisma.vaultImage.deleteMany({ where: { userId } });
  }

  clearVaultUnlockCookie();

  return { ok: true };
}

export async function lockVaultManually(): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false };
  }
  clearVaultUnlockCookie();
  return { ok: true };
}
