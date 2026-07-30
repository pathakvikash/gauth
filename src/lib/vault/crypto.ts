import bcrypt from 'bcryptjs';
import { BCRYPT_COST } from './constants';

export function canonicalizeSequence(ids: string[]): string {
  return ids.map((id) => id.trim()).join('|');
}

export async function hashSequence(ids: string[]): Promise<string> {
  return bcrypt.hash(canonicalizeSequence(ids), BCRYPT_COST);
}

export async function verifySequence(ids: string[], hash: string): Promise<boolean> {
  return bcrypt.compare(canonicalizeSequence(ids), hash);
}
