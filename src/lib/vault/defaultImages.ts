export type PatternIconKey = 'star' | 'moon' | 'sun' | 'bolt' | 'diamond' | 'hex';

export interface DefaultVaultImage {
  id: string;
  iconKey: PatternIconKey;
  label: string;
}

export const DEFAULT_VAULT_IMAGES: DefaultVaultImage[] = [
  { id: 'default:star', iconKey: 'star', label: 'Star' },
  { id: 'default:moon', iconKey: 'moon', label: 'Moon' },
  { id: 'default:sun', iconKey: 'sun', label: 'Sun' },
  { id: 'default:bolt', iconKey: 'bolt', label: 'Bolt' },
  { id: 'default:diamond', iconKey: 'diamond', label: 'Diamond' },
  { id: 'default:hex', iconKey: 'hex', label: 'Hexagon' },
];

export function isDefaultImageId(id: string): boolean {
  return id.startsWith('default:');
}
