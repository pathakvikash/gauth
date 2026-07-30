export const MAX_UNLOCK_ATTEMPTS = 3;
export const LOCKOUT_MINUTES = 5;
export const BCRYPT_COST = 12;
export const MIN_SEQUENCE_LENGTH = 4;
export const GRID_SIZES = [3, 4] as const;

export const VAULT_UNLOCK_COOKIE_NAME = 'gauth_vault_unlocked';
export const VAULT_UNLOCK_TTL_SECONDS = 60 * 10;
export const VAULT_UNLOCK_ABSOLUTE_MAX_SECONDS = 60 * 60;
