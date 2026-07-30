import { z } from 'zod';
import { MIN_SEQUENCE_LENGTH, GRID_SIZES } from '@/lib/vault/constants';

export const vaultMethodTypeSchema = z.enum(['GRAPHICAL', 'GRID_PATTERN']);

export const vaultSetupSchema = z
  .object({
    type: vaultMethodTypeSchema,
    sequence: z.array(z.string().min(1)).min(MIN_SEQUENCE_LENGTH).max(12),
    gridSize: z.number().int().optional(),
  })
  .refine(
    (data) =>
      data.type !== 'GRID_PATTERN' ||
      (data.gridSize !== undefined && (GRID_SIZES as readonly number[]).includes(data.gridSize)),
    { message: `gridSize must be one of ${GRID_SIZES.join(', ')} for GRID_PATTERN`, path: ['gridSize'] }
  );

export const vaultUnlockSchema = z.object({
  type: vaultMethodTypeSchema,
  sequence: z.array(z.string().min(1)).min(1).max(12),
});

export const vaultResetSchema = z.object({
  type: vaultMethodTypeSchema,
});

export type VaultSetupInput = z.infer<typeof vaultSetupSchema>;
export type VaultUnlockInput = z.infer<typeof vaultUnlockSchema>;
export type VaultResetInput = z.infer<typeof vaultResetSchema>;
