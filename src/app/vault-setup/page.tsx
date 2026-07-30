import { requireUnlockedVaultSession } from '@/lib/vault/guard';
import { VaultSetupForm } from '@/components/vault/VaultSetupForm';

export default async function ManageVaultMethodsPage() {
  await requireUnlockedVaultSession('/vault-setup');

  return (
    <div className="flex-1 py-16 px-4">
      <h1 className="text-2xl font-semibold text-center text-gold mb-2">Manage vault methods</h1>
      <p className="text-center text-white/60 mb-8 max-w-md mx-auto">
        Set up a new method, or save over an existing one. Methods you don&apos;t touch
        stay as they are.
      </p>
      <VaultSetupForm />
    </div>
  );
}
