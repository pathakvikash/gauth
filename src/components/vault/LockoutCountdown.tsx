'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function LockoutCountdown({ seconds }: { seconds: number }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      router.push('/vault/unlock');
      router.refresh();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, router]);

  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  return (
    <div className="text-4xl font-mono text-gold">
      {mm}:{ss}
    </div>
  );
}
