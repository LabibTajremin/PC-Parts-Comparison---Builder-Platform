import { prisma } from '../shared/database';
import { logger } from '../shared/logger';
import { cacheDel } from '../shared/redis';
import { IScraper } from './base.scraper';

export class ScraperManager {
  private scrapers: IScraper[] = [];

  register(scraper: IScraper) {
    this.scrapers.push(scraper);
  }

  async runAll() {
    for (const scraper of this.scrapers) {
      await this.runScraper(scraper);
    }
  }

  private async runScraper(scraper: IScraper) {
    const log = await prisma.priceUpdateLog.create({
      data: {
        vendorId: scraper.vendorId,
        status: 'PARTIAL',
        startedAt: new Date(),
      },
    });

    try {
      const products = await scraper.scrape();
      let updated = 0;

      for (const scraped of products) {
        // Match by name similarity (simple contains match for V1)
        const dbProduct = await prisma.product.findFirst({
          where: { name: { contains: scraped.name.split(' ').slice(0, 3).join(' '), mode: 'insensitive' } },
        });

        if (!dbProduct) continue;

        await prisma.vendorPrice.upsert({
          where: { productId_vendorId: { productId: dbProduct.id, vendorId: scraper.vendorId } },
          update: { price: scraped.price, inStock: scraped.inStock, lastUpdated: new Date(), isStale: false, vendorUrl: scraped.productUrl },
          create: {
            productId: dbProduct.id,
            vendorId: scraper.vendorId,
            price: scraped.price,
            currency: scraped.currency,
            vendorUrl: scraped.productUrl,
            inStock: scraped.inStock,
            isLowest: false,
          },
        });
        updated++;
      }

      await prisma.priceUpdateLog.update({
        where: { id: log.id },
        data: { status: 'SUCCESS', productsUpdated: updated, completedAt: new Date() },
      });

      await cacheDel('products:*');
      logger.info(`Scraper ${scraper.vendorName}: updated ${updated} products`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      await prisma.vendorPrice.updateMany({ where: { vendorId: scraper.vendorId }, data: { isStale: true } });
      await prisma.priceUpdateLog.update({
        where: { id: log.id },
        data: { status: 'FAILED', errorMessage: message, completedAt: new Date() },
      });
      logger.error(`Scraper ${scraper.vendorName} failed: ${message}`);
    }
  }
}

export const scraperManager = new ScraperManager();
