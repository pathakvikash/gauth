import { SignJWT, jwtVerify } from 'jose';
import { VAULT_UNLOCK_TTL_SECONDS } from './constants';

function getSecret(): Uint8Array {
  const secret = process.env.VAULT_COOKIE_SECRET;
  if (!secret) {
    throw new Error('VAULT_COOKIE_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function signVaultUnlockToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${VAULT_UNLOCK_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyVaultUnlockToken(
  token: string | undefined,
  expectedUserId: string
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.sub === expectedUserId;
  } catch {
    return false;
  }
}
