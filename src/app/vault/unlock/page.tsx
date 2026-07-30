import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLockoutStatus } from '@/lib/vault/lockout';
import { VaultUnlockForm } from '@/components/vault/VaultUnlockForm';
import type { VaultMethodType } from '@/lib/vault/types';

export default async function VaultUnlockPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }
  const userId = session.user.id;

  const credentials = await prisma.vaultCredential.findMany({
    where: { userId, isActive: true },
  });
  if (credentials.length === 0) {
    redirect('/profile');
  }

  const lockout = await getLockoutStatus(userId);
  if (lockout.locked) {
    redirect('/vault/locked');
  }

  const images = await prisma.vaultImage.findMany({
    where: { userId },
    orderBy: { sortOrder: 'asc' },
  });

  const gridSizeByMethod: Partial<Record<VaultMethodType, number>> = {};
  for (const credential of credentials) {
    if (credential.gridSize) {
      gridSizeByMethod[credential.type as VaultMethodType] = credential.gridSize;
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-16 px-4">
      <h1 className="text-2xl font-semibold text-center text-gold mb-2">Unlock your vault</h1>
      <p className="text-center text-white/60 mb-8">Replay your pattern to continue.</p>
      <VaultUnlockForm
        methods={credentials.map((c) => c.type as VaultMethodType)}
        uploadedImages={images.map((img) => ({ id: img.id, src: `/api/vault/images/${img.id}/raw` }))}
        gridSizeByMethod={gridSizeByMethod}
      />
    </div>
  );
}
