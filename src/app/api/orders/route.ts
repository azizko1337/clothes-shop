import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, address, email } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Calculate totals and verify prices
    let totalProductsPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({ error: `Product with id ${item.productId} not found` }, { status: 400 });
      }

      const itemTotal = product.price * item.quantity;
      totalProductsPrice += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        price: product.price,
      });
    }

    const deliveryPrice = 15.00; // Fixed delivery price for now

    const order = await prisma.order.create({
      data: {
        address,
        email,
        totalProductsPrice,
        deliveryPrice,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
