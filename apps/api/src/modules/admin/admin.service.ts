import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/database';
import { AppError } from '../../middleware/error.middleware';
import { cacheDel } from '../../shared/redis';

export class AdminService {
  async login(email: string, password: string) {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLogin: new Date() } });

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.ADMIN_JWT_SECRET || 'secret',
      { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '24h' }
    );

    return { token, admin: { id: admin.id, email: admin.email, name: admin.name } };
  }

  async getProducts() {
    return prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { prices: { include: { vendor: true } } },
    });
  }

  async createProduct(data: {
    name: string;
    slug: string;
    category: string;
    brand: string;
    model: string;
    imageUrl?: string;
    description?: string;
    specifications: Record<string, unknown>;
  }) {
    const product = await prisma.product.create({ data: data as Parameters<typeof prisma.product.create>[0]['data'] });
    await cacheDel('products:list:*');
    return product;
  }

  async updateProduct(id: string, data: Partial<{
    name: string; slug: string; isActive: boolean;
    description: string; imageUrl: string; specifications: Record<string, unknown>;
  }>) {
    const product = await prisma.product.update({ where: { id }, data });
    await cacheDel(`products:detail:${id}`);
    await cacheDel('products:list:*');
    return product;
  }

  async deleteProduct(id: string) {
    const product = await prisma.product.update({ where: { id }, data: { isActive: false } });
    await cacheDel(`products:detail:${id}`);
    await cacheDel('products:list:*');
    return product;
  }

  async getVendors() {
    return prisma.vendor.findMany({ orderBy: { name: 'asc' } });
  }

  async createVendor(data: { name: string; slug: string; websiteUrl: string; logoUrl?: string }) {
    return prisma.vendor.create({ data });
  }

  async updateVendor(id: string, data: Partial<{ name: string; websiteUrl: string; logoUrl: string; isActive: boolean }>) {
    return prisma.vendor.update({ where: { id }, data });
  }

  async overridePrice(productId: string, vendorId: string, price: number, vendorUrl?: string) {
    const updated = await prisma.vendorPrice.upsert({
      where: { productId_vendorId: { productId, vendorId } },
      update: { price, lastUpdated: new Date(), isStale: false, ...(vendorUrl && { vendorUrl }) },
      create: {
        productId, vendorId, price, currency: 'BDT',
        vendorUrl: vendorUrl || '',
        inStock: true,
        isLowest: false,
      },
    });

    // Recalculate lowest
    const allPrices = await prisma.vendorPrice.findMany({ where: { productId } });
    const minPrice = Math.min(...allPrices.map((p) => Number(p.price)));
    for (const p of allPrices) {
      await prisma.vendorPrice.update({ where: { id: p.id }, data: { isLowest: Number(p.price) === minPrice } });
    }

    await cacheDel(`products:detail:${productId}`);
    await cacheDel(`products:prices:${productId}`);
    return updated;
  }

  async getPriceLogs() {
    return prisma.priceUpdateLog.findMany({ orderBy: { startedAt: 'desc' }, take: 50 });
  }
}
