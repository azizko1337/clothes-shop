import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();
    const { images } = body; // Array of image IDs in order

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Use transaction to update all
    await prisma.$transaction(
      images.map((imageId: number, index: number) =>
        prisma.productImage.update({
          where: { id: imageId, productId }, // Ensure it belongs to the product
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ message: 'Images reordered successfully' });
  } catch (error) {
    console.error('Error reordering images:', error);
    return NextResponse.json({ error: 'Failed to reorder images' }, { status: 500 });
  }
}
