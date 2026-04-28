import { ProductRepository, ProductFilters } from './product.repository';
import { cacheGet, cacheSet, cacheDel, hashFilters } from '../../shared/redis';
import { CACHE_KEYS, CACHE_TTL, PRICE_STALE_THRESHOLD_HOURS } from '../../shared/constants';

interface PriceRow {
  id: string;
  productId: string;
  vendorId: string;
  price: number;
  currency: string;
  vendorUrl: string;
  inStock: boolean;
  isLowest: boolean;
  lastUpdated: Date;
  isStale: boolean;
  vendor?: unknown;
}

export class ProductService {
  private repo = new ProductRepository();

  private isStale(lastUpdated: Date): boolean {
    const hours = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
    return hours > PRICE_STALE_THRESHOLD_HOURS;
  }

  private enrichProduct(product: Awaited<ReturnType<ProductRepository['findById']>>) {
    if (!product) return null;
    const prices: PriceRow[] = product.prices.map((p: { price: unknown; lastUpdated: Date; [key: string]: unknown }) => ({
      ...p,
      price: p.price as number,
      isStale: this.isStale(p.lastUpdated),
    }));
    const lowestPrice = prices.find((p) => p.isLowest) || prices[0] || null;
    return { ...product, prices, lowestPrice };
  }

  async getProducts(filters: ProductFilters) {
    const cacheKey = CACHE_KEYS.PRODUCTS_LIST(hashFilters(filters as Record<string, unknown>));
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const result = await this.repo.findMany(filters);

    let products = result.products.map((p) => this.enrichProduct(p)!);

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      products = products.filter((p) => {
        const lowest = p.lowestPrice?.price;
        if (lowest === undefined) return false;
        if (filters.minPrice !== undefined && (lowest as number) < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && (lowest as number) > filters.maxPrice) return false;
        return true;
      });
    }

    if (filters.sortBy === 'price_asc') {
      products.sort((a, b) => ((a.lowestPrice?.price as number) || 0) - ((b.lowestPrice?.price as number) || 0));
    } else if (filters.sortBy === 'price_desc') {
      products.sort((a, b) => ((b.lowestPrice?.price as number) || 0) - ((a.lowestPrice?.price as number) || 0));
    }

    const totalPages = Math.ceil(result.total / result.limit);
    const response = {
      data: products,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages,
    };

    await cacheSet(cacheKey, response, CACHE_TTL.PRODUCTS_LIST);
    return response;
  }

  async getProductById(id: string) {
    const cacheKey = CACHE_KEYS.PRODUCTS_DETAIL(id);
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const product = await this.repo.findById(id);
    if (!product) return null;

    const enriched = this.enrichProduct(product);
    await cacheSet(cacheKey, enriched, CACHE_TTL.PRODUCTS_DETAIL);
    return enriched;
  }

  async getProductPrices(productId: string) {
    const cacheKey = CACHE_KEYS.PRODUCTS_PRICES(productId);
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const prices = await this.repo.findPrices(productId);
    const enriched: PriceRow[] = prices.map((p: { price: unknown; lastUpdated: Date; [key: string]: unknown }) => ({
      ...p,
      price: p.price as number,
      isStale: this.isStale(p.lastUpdated),
    }));

    await cacheSet(cacheKey, enriched, CACHE_TTL.PRODUCTS_PRICES);
    return enriched;
  }

  async createProduct(data: Parameters<ProductRepository['create']>[0]) {
    const product = await this.repo.create(data);
    await cacheDel('products:list:*');
    return product;
  }

  async updateProduct(id: string, data: Parameters<ProductRepository['update']>[1]) {
    const product = await this.repo.update(id, data);
    await cacheDel(`products:detail:${id}`);
    await cacheDel('products:list:*');
    return product;
  }

  async deleteProduct(id: string) {
    const product = await this.repo.delete(id);
    await cacheDel(`products:detail:${id}`);
    await cacheDel('products:list:*');
    return product;
  }
}
