'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { VaultMethodType } from '@/lib/vault/types';
import { lockVaultManually, resetVault } from '@/actions/vault-reset';

export function ProfileActions({ methods }: { methods: VaultMethodType[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLockNow() {
    startTransition(async () => {
      await lockVaultManually();
      router.push('/vault/unlock');
      router.refresh();
    });
  }

  function handleReset(type: VaultMethodType) {
    const label = type === 'GRAPHICAL' ? 'image' : 'grid';
    if (!confirm(`Reset your ${label} pattern? You'll need to set a new one before continuing.`)) {
      return;
    }
    startTransition(async () => {
      await resetVault({ type });
      router.push('/profile');
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleLockNow}
        disabled={pending}
        className="bg-ink border border-gold text-gold px-4 py-2 rounded-md disabled:opacity-50"
      >
        Lock vault now
      </button>
      {methods.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => handleReset(m)}
          disabled={pending}
          className="bg-red-950 border border-red-500 text-red-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Reset {m === 'GRAPHICAL' ? 'image' : 'grid'} pattern
        </button>
      ))}
    </div>
  );
}
