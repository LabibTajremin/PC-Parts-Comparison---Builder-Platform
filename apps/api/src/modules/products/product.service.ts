import { ProductRepository, ProductFilters } from './product.repository';
import { cacheGet, cacheSet, cacheDel, hashFilters } from '../../shared/redis';
import { CACHE_KEYS, CACHE_TTL, PRICE_STALE_THRESHOLD_HOURS } from '../../shared/constants';

// Mirrors VendorPrice shape from Prisma (without the computed isStale field)
interface RawPrice {
  id: string;
  productId: string;
  vendorId: string;
  price: number;
  currency: string;
  vendorUrl: string;
  inStock: boolean;
  isLowest: boolean;
  lastUpdated: Date;
  vendor?: Record<string, unknown>;
}

interface EnrichedPrice extends RawPrice {
  isStale: boolean;
}

interface EnrichedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  model: string;
  imageUrl: string | null;
  description: string | null;
  specifications: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  prices: EnrichedPrice[];
  lowestPrice: EnrichedPrice | null;
}

export class ProductService {
  private repo = new ProductRepository();

  private isStale(lastUpdated: Date): boolean {
    const hours = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
    return hours > PRICE_STALE_THRESHOLD_HOURS;
  }

  private enrichProduct(product: Awaited<ReturnType<ProductRepository['findById']>>): EnrichedProduct | null {
    if (!product) return null;
    const prices: EnrichedPrice[] = (product.prices as RawPrice[]).map((p) => ({
      ...p,
      isStale: this.isStale(p.lastUpdated),
    }));
    const lowestPrice = prices.find((p) => p.isLowest) ?? prices[0] ?? null;
    return { ...(product as unknown as EnrichedProduct), prices, lowestPrice };
  }

  async getProducts(filters: ProductFilters) {
    const cacheKey = CACHE_KEYS.PRODUCTS_LIST(hashFilters(filters as unknown as Record<string, unknown>));
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const result = await this.repo.findMany(filters);
    let products: EnrichedProduct[] = result.products.map((p) => this.enrichProduct(p)!);

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      products = products.filter((p: EnrichedProduct) => {
        const lowest = p.lowestPrice?.price;
        if (lowest === undefined) return false;
        if (filters.minPrice !== undefined && lowest < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && lowest > filters.maxPrice) return false;
        return true;
      });
    }

    if (filters.sortBy === 'price_asc') {
      products.sort((a: EnrichedProduct, b: EnrichedProduct) =>
        (a.lowestPrice?.price ?? 0) - (b.lowestPrice?.price ?? 0));
    } else if (filters.sortBy === 'price_desc') {
      products.sort((a: EnrichedProduct, b: EnrichedProduct) =>
        (b.lowestPrice?.price ?? 0) - (a.lowestPrice?.price ?? 0));
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
    const enriched: EnrichedPrice[] = (prices as RawPrice[]).map((p) => ({
      ...p,
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
