import { ComponentCategory, Prisma } from '@prisma/client';
import { prisma } from '../../shared/database';
import { PAGINATION } from '../../shared/constants';

export interface ProductFilters {
  category?: ComponentCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'name';
  page?: number;
  limit?: number;
  search?: string;
}

export class ProductRepository {
  async findMany(filters: ProductFilters) {
    const page = filters.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(filters.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (filters.category) where.category = filters.category;
    if (filters.brand) where.brand = { contains: filters.brand, mode: 'insensitive' };
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { name: 'asc' };
    if (filters.sortBy === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          prices: {
            include: { vendor: true },
            orderBy: { price: 'asc' },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  }

  async findById(id: string) {
    return prisma.product.findFirst({
      where: { id, isActive: true },
      include: {
        prices: {
          include: { vendor: true },
          orderBy: { price: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        prices: {
          include: { vendor: true },
          orderBy: { price: 'asc' },
        },
      },
    });
  }

  async findPrices(productId: string) {
    return prisma.vendorPrice.findMany({
      where: { productId },
      include: { vendor: true },
      orderBy: { price: 'asc' },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.product.update({ where: { id }, data: { isActive: false } });
  }
}
