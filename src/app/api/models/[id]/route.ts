import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { modelData: true, modelMimeType: true },
    });

    if (!product || !product.modelData) {
      return new NextResponse('Model not found', { status: 404 });
    }

    return new NextResponse(product.modelData, {
      headers: {
        'Content-Type': product.modelMimeType || 'application/octet-stream',
        'Content-Length': product.modelData.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching model:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
