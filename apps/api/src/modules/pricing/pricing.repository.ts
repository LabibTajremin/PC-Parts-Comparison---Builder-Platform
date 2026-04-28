import { prisma } from '../../shared/database';

export class PricingRepository {
  async updatePrice(productId: string, vendorId: string, price: number) {
    const updated = await prisma.vendorPrice.upsert({
      where: { productId_vendorId: { productId, vendorId } },
      update: { price, lastUpdated: new Date(), isStale: false },
      create: { productId, vendorId, price, currency: 'BDT', vendorUrl: '', inStock: true, isLowest: false },
    });

    // Recalculate lowest
    const allPrices = await prisma.vendorPrice.findMany({ where: { productId } });
    const min = Math.min(...allPrices.map((p) => Number(p.price)));
    for (const p of allPrices) {
      await prisma.vendorPrice.update({ where: { id: p.id }, data: { isLowest: Number(p.price) === min } });
    }
    return updated;
  }

  async markStale(vendorId: string) {
    return prisma.vendorPrice.updateMany({ where: { vendorId }, data: { isStale: true } });
  }
}
