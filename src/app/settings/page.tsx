import { prisma } from '@/lib/prisma';
import { requireUnlockedVaultSession } from '@/lib/vault/guard';
import { AccountSettingsForm } from '@/components/profile/AccountSettingsForm';

export default async function SettingsPage() {
  const session = await requireUnlockedVaultSession('/settings');
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { displayName: true },
  });

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 w-full">
      <h1 className="text-2xl font-semibold text-gold mb-6">Account settings</h1>
      <div className="bg-panel rounded-xl p-8">
        <AccountSettingsForm currentDisplayName={user?.displayName ?? null} />
      </div>
    </div>
  );
}
