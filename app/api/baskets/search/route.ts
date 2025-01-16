import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchQuery = request.nextUrl.searchParams.get('q');
  const theme = request.nextUrl.searchParams.get('theme');

  try {
    const baskets = await prisma.basket.findMany({
      where: {
        isPublic: true,
        AND: [
          searchQuery ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } },
            ],
          } : {},
          theme ? { theme: { equals: theme, mode: 'insensitive' } } : {},
        ],
      },
      include: {
        holdings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(baskets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search baskets' },
      { status: 500 }
    );
  }
} 