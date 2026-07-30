'use client';

import { useEffect, useState, useTransition, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { saveVaultSetup } from '@/actions/vault-setup';
import { DEFAULT_VAULT_IMAGES } from '@/lib/vault/defaultImages';
import { MIN_SEQUENCE_LENGTH } from '@/lib/vault/constants';
import { ImagePatternPicker, type PickerImage } from './ImagePatternPicker';
import { GridPatternPad } from './GridPatternPad';

type Method = 'GRAPHICAL' | 'GRID_PATTERN';

export function VaultSetupForm() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('GRAPHICAL');
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [sequence, setSequence] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<PickerImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/vault/images')
      .then((res) => res.json())
      .then((data) =>
        setUploadedImages(
          (data.images ?? []).map((img: { id: string; url: string }) => ({ id: img.id, src: img.url }))
        )
      )
      .catch(() => {});
  }, []);

  function handleMethodChange(next: Method) {
    setMethod(next);
    setSequence([]);
    setError(null);
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/vault/images', { method: 'POST', body: formData });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? 'Upload failed');
        }
        const created = await res.json();
        setUploadedImages((prev) => [...prev, { id: created.id, src: created.url }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  function handleSubmit() {
    setError(null);
    if (sequence.length < MIN_SEQUENCE_LENGTH) {
      setError(`Select at least ${MIN_SEQUENCE_LENGTH} steps to build a pattern.`);
      return;
    }
    startTransition(async () => {
      const result = await saveVaultSetup({
        type: method,
        sequence,
        gridSize: method === 'GRID_PATTERN' ? gridSize : undefined,
      });
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong');
        return;
      }
      router.push('/profile');
      router.refresh();
    });
  }

  const pickerImages: PickerImage[] = [
    ...DEFAULT_VAULT_IMAGES.map((img) => ({ id: img.id, iconKey: img.iconKey, label: img.label })),
    ...uploadedImages,
  ];

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleMethodChange('GRAPHICAL')}
          className={`flex-1 py-2 rounded-md transition ${
            method === 'GRAPHICAL' ? 'bg-gold text-ink' : 'bg-panel text-white'
          }`}
        >
          Image pattern
        </button>
        <button
          type="button"
          onClick={() => handleMethodChange('GRID_PATTERN')}
          className={`flex-1 py-2 rounded-md transition ${
            method === 'GRID_PATTERN' ? 'bg-gold text-ink' : 'bg-panel text-white'
          }`}
        >
          Grid pattern
        </button>
      </div>

      {method === 'GRAPHICAL' ? (
        <div className="space-y-3">
          <p className="text-white/70 text-sm">
            Click images in the order you want to memorize. Use the default set below, or
            upload your own for a more private pattern.
          </p>
          <ImagePatternPicker images={pickerImages} sequence={sequence} onChange={setSequence} />
          <label className="block text-sm text-gold cursor-pointer">
            {uploading ? 'Uploading…' : '+ Upload your own images'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-white/70 text-sm">Draw a connecting pattern by tapping nodes in order.</p>
          <div className="flex gap-2 justify-center text-sm">
            <button
              type="button"
              onClick={() => {
                setGridSize(3);
                setSequence([]);
              }}
              className={`px-3 py-1 rounded ${gridSize === 3 ? 'bg-gold text-ink' : 'bg-panel text-white'}`}
            >
              3x3
            </button>
            <button
              type="button"
              onClick={() => {
                setGridSize(4);
                setSequence([]);
              }}
              className={`px-3 py-1 rounded ${gridSize === 4 ? 'bg-gold text-ink' : 'bg-panel text-white'}`}
            >
              4x4
            </button>
          </div>
          <GridPatternPad size={gridSize} sequence={sequence} onChange={setSequence} />
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={pending}
        className="w-full bg-gold text-ink font-semibold py-2 rounded-md disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save vault pattern'}
      </button>
    </div>
  );
}
