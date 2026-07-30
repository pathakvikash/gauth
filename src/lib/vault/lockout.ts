import { prisma } from '@/lib/prisma';
import type { VaultMethodType } from './types';
import { verifySequence } from './crypto';
import { issueVaultUnlockCookie } from './cookie';
import { sendSecurityAlert } from '@/lib/email';
import { MAX_UNLOCK_ATTEMPTS, LOCKOUT_MINUTES } from './constants';

export interface LockoutStatus {
  locked: boolean;
  retryAfterSeconds?: number;
  consecutiveFails: number;
}

async function computeLockoutStatus(userId: string): Promise<LockoutStatus> {
  const recent = await prisma.vaultAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: MAX_UNLOCK_ATTEMPTS + 1,
  });

  let consecutiveFails = 0;
  for (const attempt of recent) {
    if (attempt.success) break;
    consecutiveFails++;
  }

  if (consecutiveFails >= MAX_UNLOCK_ATTEMPTS) {
    const lastAttempt = recent[0];
    const lockUntil = new Date(lastAttempt.createdAt.getTime() + LOCKOUT_MINUTES * 60_000);
    const now = new Date();
    if (now < lockUntil) {
      return {
        locked: true,
        retryAfterSeconds: Math.ceil((lockUntil.getTime() - now.getTime()) / 1000),
        consecutiveFails,
      };
    }
  }

  return { locked: false, consecutiveFails };
}

export async function getLockoutStatus(userId: string): Promise<LockoutStatus> {
  return computeLockoutStatus(userId);
}

export interface AttemptUnlockParams {
  userId: string;
  userEmail: string;
  method: VaultMethodType;
  sequence: string[];
  ip?: string;
  userAgent?: string;
}

export interface AttemptUnlockResult {
  success: boolean;
  locked?: boolean;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  notConfigured?: boolean;
}

export async function attemptVaultUnlock(params: AttemptUnlockParams): Promise<AttemptUnlockResult> {
  const { userId, userEmail, method, sequence, ip, userAgent } = params;

  const status = await computeLockoutStatus(userId);
  if (status.locked) {
    return { success: false, locked: true, retryAfterSeconds: status.retryAfterSeconds };
  }

  const credential = await prisma.vaultCredential.findUnique({
    where: { userId_type: { userId, type: method } },
  });
  if (!credential || !credential.isActive) {
    return { success: false, notConfigured: true };
  }

  const ok = await verifySequence(sequence, credential.secretHash);

  await prisma.vaultAttempt.create({
    data: { userId, method, success: ok, ip, userAgent },
  });

  if (ok) {
    await issueVaultUnlockCookie(userId);
    return { success: true };
  }

  const newConsecutiveFails = status.consecutiveFails + 1;
  if (newConsecutiveFails >= MAX_UNLOCK_ATTEMPTS) {
    sendSecurityAlert(userEmail, { ip, userAgent, when: new Date() }).catch((err) => {
      console.error('Failed to send vault lockout security alert', err);
    });
    return { success: false, locked: true, retryAfterSeconds: LOCKOUT_MINUTES * 60 };
  }

  return { success: false, remainingAttempts: MAX_UNLOCK_ATTEMPTS - newConsecutiveFails };
}
