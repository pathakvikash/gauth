import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const images = await prisma.vaultImage.findMany({
    where: { userId: session.user.id },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, mimeType: true, sortOrder: true, createdAt: true },
  });

  return NextResponse.json({
    images: images.map((img) => ({ ...img, url: `/api/vault/images/${img.id}/raw` })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('image');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 2MB)' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const count = await prisma.vaultImage.count({ where: { userId: session.user.id } });

  const image = await prisma.vaultImage.create({
    data: {
      userId: session.user.id,
      data: bytes,
      mimeType: file.type,
      sortOrder: count,
    },
    select: { id: true, sortOrder: true },
  });

  return NextResponse.json(
    { id: image.id, sortOrder: image.sortOrder, url: `/api/vault/images/${image.id}/raw` },
    { status: 201 }
  );
}
