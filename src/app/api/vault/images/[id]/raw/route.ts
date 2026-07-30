import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const image = await prisma.vaultImage.findUnique({ where: { id: params.id } });
  if (!image || image.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'private, max-age=86400',
    },
  });
}
