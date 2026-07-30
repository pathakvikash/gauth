'use client';

/* eslint-disable @next/next/no-img-element -- uploaded images are dynamic API content, not static assets Next can optimize */

import type { PatternIconKey } from '@/lib/vault/defaultImages';
import { PatternIcon } from './PatternIcons';

export interface PickerImage {
  id: string;
  label?: string;
  src?: string;
  iconKey?: PatternIconKey;
}

interface ImagePatternPickerProps {
  images: PickerImage[];
  sequence: string[];
  onChange: (sequence: string[]) => void;
  maxLength?: number;
}

export function ImagePatternPicker({
  images,
  sequence,
  onChange,
  maxLength = 8,
}: ImagePatternPickerProps) {
  function handleClick(id: string) {
    if (sequence.length >= maxLength) return;
    onChange([...sequence, id]);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => {
          const positions = sequence.reduce<number[]>((acc, id, idx) => {
            if (id === image.id) acc.push(idx + 1);
            return acc;
          }, []);
          return (
            <button
              type="button"
              key={image.id}
              onClick={() => handleClick(image.id)}
              className="relative rounded-md overflow-hidden border-2 border-transparent hover:border-gold focus:outline-none focus:border-gold transition"
            >
              {image.iconKey ? (
                <div className="w-full h-24 flex items-center justify-center bg-panel">
                  <PatternIcon iconKey={image.iconKey} className="w-10 h-10 text-gold" />
                </div>
              ) : (
                <img
                  src={image.src}
                  alt={image.label ?? image.id}
                  className="w-full h-24 object-cover bg-panel"
                />
              )}
              {positions.length > 0 && (
                <span className="absolute top-1 right-1 flex gap-1">
                  {positions.map((pos) => (
                    <span
                      key={pos}
                      className="bg-gold text-ink text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {pos}
                    </span>
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 text-sm items-center">
        <button
          type="button"
          onClick={() => onChange(sequence.slice(0, -1))}
          disabled={sequence.length === 0}
          className="text-gold disabled:opacity-30"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={sequence.length === 0}
          className="text-gold disabled:opacity-30"
        >
          Clear
        </button>
        <span className="text-white/60 ml-auto">
          {sequence.length}/{maxLength} selected
        </span>
      </div>
    </div>
  );
}
