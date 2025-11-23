import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          select: {
            id: true,
            // Don't select data to avoid large payload
          }
        },
        sizes: true,
      },
    });

    const productsWithUrls = products.map(product => ({
      ...product,
      images: product.images.map(img => ({
        id: img.id,
        url: `/api/images/${img.id}`,
      })),
      modelUrl: product.modelData ? `/api/models/${product.id}` : product.modelUrl
    }));

    return NextResponse.json(productsWithUrls);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const composition = formData.get('composition') as string;
    const price = parseFloat(formData.get('price') as string);
    const collectionId = parseInt(formData.get('collectionId') as string);
    const modelUrl = formData.get('modelUrl') as string;
    const sizes = (formData.get('sizes') as string)?.split(',').map(s => s.trim()).filter(s => s) || [];
    
    const imageFile = formData.get('imageFile') as File | null;
    const modelFile = formData.get('modelFile') as File | null;

    if (!name || !description || !composition || !price || !collectionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const imagesCreateData = [];
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imagesCreateData.push({
        data: buffer,
        mimeType: imageFile.type,
      });
    }

    let modelData: Buffer | undefined;
    let modelMimeType: string | undefined;
    if (modelFile) {
        modelData = Buffer.from(await modelFile.arrayBuffer());
        modelMimeType = modelFile.type;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        composition,
        price,
        collectionId,
        modelUrl,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        modelData: modelData as any,
        modelMimeType,
        images: {
          create: imagesCreateData.map(img => ({
            ...img,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: img.data as any
          })),
        },
        sizes: {
          create: sizes.map((size: string) => ({ size })),
        },
      },
      include: {
        images: {
            select: { id: true }
        },
        sizes: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
