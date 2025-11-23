import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, address, shippedAt, deliveredAt } = body;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status,
        address,
        shippedAt: shippedAt ? new Date(shippedAt) : null,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}
