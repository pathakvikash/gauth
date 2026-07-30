'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { VaultMethodType } from '@/lib/vault/types';
import { attemptUnlock } from '@/actions/vault-unlock';
import { DEFAULT_VAULT_IMAGES } from '@/lib/vault/defaultImages';
import { ImagePatternPicker, type PickerImage } from './ImagePatternPicker';
import { GridPatternPad } from './GridPatternPad';

interface VaultUnlockFormProps {
  methods: VaultMethodType[];
  uploadedImages: PickerImage[];
  gridSizeByMethod: Partial<Record<VaultMethodType, number>>;
}

export function VaultUnlockForm({ methods, uploadedImages, gridSizeByMethod }: VaultUnlockFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get('from') ?? '/profile';

  const [method, setMethod] = useState<VaultMethodType>(methods[0]);
  const [sequence, setSequence] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const gridSize = ((gridSizeByMethod[method] as 3 | 4) ?? 3) as 3 | 4;
  const pickerImages: PickerImage[] = [
    ...DEFAULT_VAULT_IMAGES.map((img) => ({ id: img.id, iconKey: img.iconKey, label: img.label })),
    ...uploadedImages,
  ];

  function handleMethodChange(next: VaultMethodType) {
    setMethod(next);
    setSequence([]);
    setError(null);
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await attemptUnlock({ type: method, sequence });
      if (result.locked) {
        router.push('/vault/locked');
        return;
      }
      if (!result.success) {
        setError(
          result.remainingAttempts !== undefined
            ? `Incorrect pattern. ${result.remainingAttempts} attempt(s) left before lockout.`
            : result.error ?? 'Incorrect pattern'
        );
        setSequence([]);
        return;
      }
      router.push(destination);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {methods.length > 1 && (
        <div className="flex gap-2">
          {methods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleMethodChange(m)}
              className={`flex-1 py-2 rounded-md transition ${
                method === m ? 'bg-gold text-ink' : 'bg-panel text-white'
              }`}
            >
              {m === 'GRAPHICAL' ? 'Image pattern' : 'Grid pattern'}
            </button>
          ))}
        </div>
      )}

      {method === 'GRAPHICAL' ? (
        <ImagePatternPicker images={pickerImages} sequence={sequence} onChange={setSequence} />
      ) : (
        <GridPatternPad size={gridSize} sequence={sequence} onChange={setSequence} />
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={pending || sequence.length === 0}
        className="w-full bg-gold text-ink font-semibold py-2 rounded-md disabled:opacity-50"
      >
        {pending ? 'Checking…' : 'Unlock vault'}
      </button>
    </div>
  );
}
