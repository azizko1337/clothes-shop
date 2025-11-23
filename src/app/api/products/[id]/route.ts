import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();
    const { name, description, composition, modelUrl, images, sizes } = body;

    // Transaction to ensure consistency
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          composition,
          modelUrl,
        },
      });

      // Update images if provided
      if (images) {
        await tx.productImage.deleteMany({
          where: { productId },
        });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((url: string) => ({ url, productId })),
          });
        }
      }

      // Update sizes if provided
      if (sizes) {
        await tx.productSize.deleteMany({
          where: { productId },
        });
        if (sizes.length > 0) {
          await tx.productSize.createMany({
            data: sizes.map((size: string) => ({ size, productId })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id: productId },
        include: {
          images: true,
          sizes: true,
        },
      });
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
