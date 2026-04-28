export interface ScrapedProduct {
  externalId: string;
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
  productUrl: string;
  imageUrl?: string;
}

export interface IScraper {
  vendorId: string;
  vendorName: string;
  scrape(): Promise<ScrapedProduct[]>;
  scrapeProduct(url: string): Promise<ScrapedProduct | null>;
}

export abstract class BaseScraper implements IScraper {
  abstract vendorId: string;
  abstract vendorName: string;
  abstract scrape(): Promise<ScrapedProduct[]>;
  abstract scrapeProduct(url: string): Promise<ScrapedProduct | null>;

  protected timeout = parseInt(process.env.SCRAPER_TIMEOUT_MS || '30000');
}
