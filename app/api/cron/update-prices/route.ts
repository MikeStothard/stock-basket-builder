import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateStockPrices, calculateBasketMetrics } from '@/lib/services/priceService';

export async function GET() {
  try {
    // Get unique symbols from all holdings
    const holdings = await prisma.holding.findMany({
      select: { symbol: true },
      distinct: ['symbol'],
    });
    
    const symbols = holdings.map(h => h.symbol);
    
    // Update prices
    await updateStockPrices(symbols);
    
    // Update metrics for all baskets
    const baskets = await prisma.basket.findMany();
    await Promise.all(
      baskets.map(basket => calculateBasketMetrics(basket.id))
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update prices:', error);
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    );
  }
} 