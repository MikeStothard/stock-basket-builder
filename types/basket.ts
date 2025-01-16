import { Prisma } from '@prisma/client';

export type BasketWithHoldings = Prisma.BasketGetPayload<{
  include: { holdings: true }
}>;

export type Holding = Prisma.HoldingGetPayload<{}>; 