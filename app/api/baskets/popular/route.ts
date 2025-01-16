import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const popularBaskets = await prisma.basket.findMany({
      where: {
        isPublic: true,
      },
      include: {
        holdings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    return NextResponse.json(popularBaskets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch popular baskets' },
      { status: 500 }
    );
  }
} 