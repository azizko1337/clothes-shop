import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: {
        releaseDate: 'desc',
      },
    });
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, releaseDate } = body;

    if (!name || !description || !releaseDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        releaseDate: new Date(releaseDate),
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
