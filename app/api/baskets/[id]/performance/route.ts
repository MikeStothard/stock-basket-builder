import { NextRequest, NextResponse } from 'next/server';
import { getBasketHistoricalPerformance } from '@/lib/services/priceService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const performance = await getBasketHistoricalPerformance(params.id);
    return NextResponse.json(performance);
  } catch (error) {
    console.error('Failed to fetch performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
} 