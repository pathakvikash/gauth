'use server';

import { z } from 'zod';
import { auth, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { clearVaultUnlockCookie } from '@/lib/vault/cookie';

const displayNameSchema = z.object({
  displayName: z.string().trim().max(80).optional(),
});

export interface UpdateDisplayNameState {
  ok: boolean;
  error?: string;
}

export async function updateDisplayName(input: unknown): Promise<UpdateDisplayNameState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: 'Not signed in' };
  }

  const parsed = displayNameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const displayName = parsed.data.displayName?.length ? parsed.data.displayName : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { displayName },
  });

  return { ok: true };
}

export async function deleteAccount(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  await prisma.user.delete({ where: { id: session.user.id } });
  clearVaultUnlockCookie();
  await signOut({ redirectTo: '/' });
}
