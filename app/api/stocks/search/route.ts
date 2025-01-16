import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchQuery = request.nextUrl.searchParams.get('q');

  if (!searchQuery) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const stocks = await prisma.stock.findMany({
      where: {
        OR: [
          { symbol: { contains: searchQuery.toUpperCase(), mode: 'insensitive' } },
          { name: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    return NextResponse.json(stocks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
} 