import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const [user, vaultCredentials, vaultImages, vaultAttempts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, displayName: true, image: true, createdAt: true },
    }),
    prisma.vaultCredential.findMany({
      where: { userId },
      select: { type: true, sequenceLen: true, gridSize: true, isActive: true, createdAt: true, updatedAt: true },
    }),
    prisma.vaultImage.findMany({
      where: { userId },
      select: { id: true, mimeType: true, sortOrder: true, createdAt: true },
    }),
    prisma.vaultAttempt.findMany({
      where: { userId },
      select: { method: true, success: true, ip: true, userAgent: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    user,
    vaultCredentials,
    vaultImages,
    vaultAttempts,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="gauth-data-export.json"',
    },
  });
}
