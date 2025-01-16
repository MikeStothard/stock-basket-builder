import prisma from '@/lib/prisma';
import { Decimal } from 'decimal.js';

interface AlphaVantageResponse {
  'Time Series (Daily)': {
    [key: string]: {
      '4. close': string;
    };
  };
}

interface HistoricalPerformance {
  date: Date;
  value: number;
  dailyChange: number;
}

export async function fetchLatestPrices(symbol: string) {
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
  const response = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
  );
  
  const data: AlphaVantageResponse = await response.json();
  const timeSeriesData = data['Time Series (Daily)'];
  
  const prices = Object.entries(timeSeriesData).map(([date, values]) => ({
    date: new Date(date),
    price: new Decimal(values['4. close']),
  }));

  return prices;
}

export async function updateStockPrices(symbols: string[]) {
  for (const symbol of symbols) {
    const prices = await fetchLatestPrices(symbol);
    
    for (const { date, price } of prices) {
      await prisma.stockPrice.upsert({
        where: {
          symbol_date: {
            symbol,
            date,
          },
        },
        update: { price },
        create: {
          symbol,
          date,
          price,
        },
      });
    }
  }
}

export async function calculateBasketMetrics(basketId: string) {
  const basket = await prisma.basket.findUnique({
    where: { id: basketId },
    include: { holdings: true },
  });

  if (!basket) return null;

  // Get latest prices for all holdings
  const latestPrices = await Promise.all(
    basket.holdings.map(async (holding) => {
      const price = await prisma.stockPrice.findFirst({
        where: { symbol: holding.symbol },
        orderBy: { date: 'desc' },
      });
      return { symbol: holding.symbol, price };
    })
  );

  // Calculate metrics
  const metrics = {
    totalValue: new Decimal(0),
    dailyChange: new Decimal(0),
    weeklyChange: new Decimal(0),
    monthlyChange: new Decimal(0),
    yearlyChange: new Decimal(0),
    lastUpdated: new Date(),
  };

  // Update basket with new metrics
  await prisma.basket.update({
    where: { id: basketId },
    data: {
      metrics: metrics,
      lastUpdated: new Date(),
    },
  });

  return metrics;
}

export async function getBasketHistoricalPerformance(basketId: string, days: number = 365): Promise<HistoricalPerformance[]> {
  const basket = await prisma.basket.findUnique({
    where: { id: basketId },
    include: { holdings: true },
  });

  if (!basket) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get historical prices for all holdings
  const holdingsPrices = await Promise.all(
    basket.holdings.map(async (holding) => {
      const prices = await prisma.stockPrice.findMany({
        where: {
          symbol: holding.symbol,
          date: { gte: startDate },
        },
        orderBy: { date: 'asc' },
      });

      return {
        symbol: holding.symbol,
        allocation: holding.allocation,
        prices,
      };
    })
  );

  // Calculate daily basket values
  const dailyValues = new Map<string, { value: Decimal; previousValue?: Decimal }>();

  holdingsPrices.forEach(({ prices, allocation }) => {
    prices.forEach((price) => {
      const dateKey = price.date.toISOString().split('T')[0];
      const holdingValue = price.price.mul(allocation).div(100);

      if (!dailyValues.has(dateKey)) {
        dailyValues.set(dateKey, { value: holdingValue });
      } else {
        const current = dailyValues.get(dateKey)!;
        dailyValues.set(dateKey, {
          ...current,
          value: current.value.add(holdingValue),
        });
      }
    });
  });

  // Convert to array and calculate daily changes
  const sortedDates = Array.from(dailyValues.keys()).sort();
  const performance: HistoricalPerformance[] = [];

  sortedDates.forEach((dateKey, index) => {
    const current = dailyValues.get(dateKey)!;
    const previous = index > 0 ? dailyValues.get(sortedDates[index - 1]) : undefined;

    const dailyChange = previous
      ? current.value.sub(previous.value).div(previous.value).toNumber()
      : 0;

    performance.push({
      date: new Date(dateKey),
      value: current.value.toNumber(),
      dailyChange,
    });
  });

  return performance;
} 