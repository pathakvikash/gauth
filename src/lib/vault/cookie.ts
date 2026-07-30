import { cookies } from 'next/headers';
import { VAULT_UNLOCK_COOKIE_NAME, VAULT_UNLOCK_TTL_SECONDS } from './constants';
import { signVaultUnlockToken, verifyVaultUnlockToken } from './token';

export async function issueVaultUnlockCookie(userId: string): Promise<void> {
  const token = await signVaultUnlockToken(userId);
  cookies().set(VAULT_UNLOCK_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: VAULT_UNLOCK_TTL_SECONDS,
  });
}

export function clearVaultUnlockCookie(): void {
  cookies().set(VAULT_UNLOCK_COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export async function isVaultUnlockedForUser(userId: string): Promise<boolean> {
  const token = cookies().get(VAULT_UNLOCK_COOKIE_NAME)?.value;
  return verifyVaultUnlockToken(token, userId);
}
