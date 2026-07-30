import { prisma } from '@/lib/prisma';
import { isVaultUnlockedForUser } from './cookie';
import type { VaultMethodType } from './types';

export interface VaultStatus {
  configured: boolean;
  methods: VaultMethodType[];
  unlocked: boolean;
}

export async function getVaultStatus(userId: string): Promise<VaultStatus> {
  const credentials = await prisma.vaultCredential.findMany({
    where: { userId, isActive: true },
    select: { type: true },
  });
  const unlocked = await isVaultUnlockedForUser(userId);
  return {
    configured: credentials.length > 0,
    methods: credentials.map((c) => c.type as VaultMethodType),
    unlocked,
  };
}
