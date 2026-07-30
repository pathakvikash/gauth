'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateDisplayName, deleteAccount } from '@/actions/profile';

export function AccountSettingsForm({ currentDisplayName }: { currentDisplayName: string | null }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(currentDisplayName ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, startSaveTransition] = useTransition();
  const [deleting, startDeleteTransition] = useTransition();

  function handleSave() {
    setError(null);
    setSaved(false);
    startSaveTransition(async () => {
      const result = await updateDisplayName({ displayName });
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong');
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  function handleDelete() {
    const confirmed = confirm(
      'Delete your account permanently? This removes your vault patterns, uploaded images, and activity history. This cannot be undone.'
    );
    if (!confirmed) return;
    startDeleteTransition(async () => {
      await deleteAccount();
    });
  }

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <label className="block text-sm text-white/70">
          Display name
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Leave blank to use your Google name"
            maxLength={80}
            className="mt-1 w-full px-3 py-2 bg-ink border border-white/20 rounded-md focus:outline-none focus:border-gold"
          />
        </label>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {saved && !error && <p className="text-green-400 text-sm">Saved.</p>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-gold text-ink font-semibold px-4 py-2 rounded-md disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-white font-medium">Your data</h3>
        <p className="text-white/60 text-sm">
          Download a JSON copy of your profile, vault method metadata, and unlock
          attempt history. Never includes your pattern secret itself.
        </p>
        <a
          href="/api/profile/export"
          download
          className="inline-block bg-panel border border-gold text-gold px-4 py-2 rounded-md hover:bg-ink transition"
        >
          Export my data
        </a>
      </div>

      <div className="space-y-3 border-t border-red-500/30 pt-6">
        <h3 className="text-red-400 font-semibold">Danger zone</h3>
        <p className="text-white/60 text-sm">
          Permanently deletes your account: profile, vault patterns, uploaded images,
          and activity history. Cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-950 border border-red-500 text-red-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete my account'}
        </button>
      </div>
    </div>
  );
}
