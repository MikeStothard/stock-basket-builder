import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const basket = await prisma.basket.create({
      data: {
        name: data.name,
        description: data.description,
        theme: data.theme,
        createdBy: 'anonymous', // TODO: Replace with actual user ID when auth is implemented
        holdings: {
          create: data.stocks.map((stock: any) => ({
            symbol: stock.symbol,
            name: stock.name,
            allocation: stock.allocation,
          })),
        },
      },
      include: {
        holdings: true,
      },
    });

    return NextResponse.json(basket);
  } catch (error) {
    console.error('Failed to create basket:', error);
    return NextResponse.json(
      { error: 'Failed to create basket' },
      { status: 500 }
    );
  }
} 