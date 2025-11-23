import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collectionId = parseInt(id);

    await prisma.collection.delete({
      where: { id: collectionId },
    });

    return NextResponse.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collectionId = parseInt(id);
    const body = await request.json();
    const { name, description, releaseDate } = body;

    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        name,
        description,
        releaseDate: new Date(releaseDate),
      },
    });

    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}
