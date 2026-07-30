import { prisma } from '@/lib/prisma';
import { requireUnlockedVaultSession } from '@/lib/vault/guard';

export default async function SecurityLogPage() {
  const session = await requireUnlockedVaultSession('/security');
  const userId = session.user.id;

  const attempts = await prisma.vaultAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 25,
  });

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 w-full">
      <h1 className="text-2xl font-semibold text-gold mb-6">Recent vault activity</h1>
      <div className="bg-panel rounded-xl divide-y divide-white/10">
        {attempts.length === 0 && <p className="p-4 text-white/60">No attempts yet.</p>}
        {attempts.map((a) => (
          <div key={a.id} className="p-4 flex justify-between text-sm">
            <span className={a.success ? 'text-green-400' : 'text-red-400'}>
              {a.success ? 'Success' : 'Failed'} ·{' '}
              {a.method === 'GRAPHICAL' ? 'Image pattern' : 'Grid pattern'}
            </span>
            <span className="text-white/50">{a.createdAt.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
