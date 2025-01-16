import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { id: params.id },
      include: {
        holdings: true,
      },
    });

    if (!basket) {
      return NextResponse.json(
        { error: 'Basket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(basket);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch basket' },
      { status: 500 }
    );
  }
} 