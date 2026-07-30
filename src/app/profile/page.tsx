import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getVaultStatus } from '@/lib/vault/status';
import { ProfileActions } from '@/components/vault/ProfileActions';
import { VaultSetupForm } from '@/components/vault/VaultSetupForm';
import type { VaultMethodType } from '@/lib/vault/types';

const VAULT_METHODS: { type: VaultMethodType; label: string }[] = [
  { type: 'GRAPHICAL', label: 'Image pattern' },
  { type: 'GRID_PATTERN', label: 'Grid pattern' },
];

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }
  const user = session.user;

  const status = await getVaultStatus(user.id);
  if (status.configured && !status.unlocked) {
    redirect('/vault/unlock?from=%2Fprofile');
  }

  if (!status.configured) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 w-full">
        <h1 className="text-2xl font-semibold text-center text-gold mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-center text-white/60 mb-8">
          Set up a pattern lock to secure your profile. You&apos;ll replay it every time
          you sign back in.
        </p>
        <VaultSetupForm />
      </div>
    );
  }

  const [dbUser, credentials] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { displayName: true } }),
    prisma.vaultCredential.findMany({ where: { userId: user.id, isActive: true } }),
  ]);
  const byType = new Map(credentials.map((c) => [c.type, c]));
  const displayName = dbUser?.displayName || user.name;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 space-y-8 w-full">
      <section className="bg-panel rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gold">Your profile</h1>
          <Link href="/settings" className="text-sm text-gold hover:underline">
            Account settings
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
            <img src={user.image} alt="" className="w-16 h-16 rounded-full" />
          )}
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-white/60 text-sm">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="bg-panel rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gold">Vault methods</h2>
          <Link href="/vault-setup" className="text-sm text-gold hover:underline">
            + Add or replace a method
          </Link>
        </div>
        <ul className="space-y-2 mb-6">
          {VAULT_METHODS.map(({ type, label }) => {
            const credential = byType.get(type);
            return (
              <li key={type} className="flex justify-between items-center text-white/80">
                <span>{type === 'GRID_PATTERN' && credential ? `${label} (${credential.gridSize}x${credential.gridSize})` : label}</span>
                {credential ? (
                  <span className="text-white/40 text-sm">
                    configured {credential.updatedAt.toLocaleDateString()}
                  </span>
                ) : (
                  <Link href="/vault-setup" className="text-sm text-gold hover:underline">
                    Set up
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <ProfileActions methods={credentials.map((c) => c.type as VaultMethodType)} />
      </section>
    </div>
  );
}
