import { prisma } from '../../shared/database';

export class VendorRepository {
  async findAll() {
    return prisma.vendor.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.vendor.findFirst({ where: { id, isActive: true } });
  }

  async create(data: { name: string; slug: string; websiteUrl: string; logoUrl?: string }) {
    return prisma.vendor.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; slug: string; websiteUrl: string; logoUrl: string; isActive: boolean }>) {
    return prisma.vendor.update({ where: { id }, data });
  }
}
