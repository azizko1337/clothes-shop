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
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const composition = formData.get('composition') as string;
    const price = parseFloat(formData.get('price') as string);
    const collectionId = parseInt(formData.get('collectionId') as string);
    const modelUrl = formData.get('modelUrl') as string;
    const glbAttribution = formData.get('glbAttribution') as string;
    const glbLink = formData.get('glbLink') as string;
    const sizes = (formData.get('sizes') as string)?.split(',').map(s => s.trim()).filter(s => s) || [];
    
    const imageFile = formData.get('imageFile') as File | null;
    const modelFile = formData.get('modelFile') as File | null;

    // Transaction to ensure consistency
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Update basic fields
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
          name,
          description,
          composition,
          price,
          collectionId,
          modelUrl,
          glbAttribution,
          glbLink,
      };

      if (modelFile) {
          updateData.modelData = Buffer.from(await modelFile.arrayBuffer());
          updateData.modelMimeType = modelFile.type;
      }

      await tx.product.update({
        where: { id: productId },
        data: updateData,
      });

      // Add new image if provided
      if (imageFile) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        await tx.productImage.create({
            data: {
                productId,
                data: buffer,
                mimeType: imageFile.type
            }
        });
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
          images: { select: { id: true } },
          sizes: true,
        },
      });
    });
    
    const productWithUrls = {
        ...updatedProduct,
        images: updatedProduct?.images.map(img => ({
            id: img.id,
            url: `/api/images/${img.id}`
        })),
        modelUrl: updatedProduct?.modelData ? `/api/models/${updatedProduct.id}` : updatedProduct?.modelUrl
    };

    return NextResponse.json(productWithUrls);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
