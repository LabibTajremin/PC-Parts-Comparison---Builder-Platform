import { prisma } from '../../shared/database';

export interface CompatibilityIssue {
  type: 'error' | 'warning';
  message: string;
  components: string[];
}

export interface BuildValidationResult {
  isCompatible: boolean;
  issues: CompatibilityIssue[];
  totalEstimatedPrice: number;
  lowestTotalPrice: number;
}

interface ProductRow {
  id: string;
  name: string;
  category: string;
  specifications: string;
  prices: Array<{ price: number; isLowest: boolean }>;
}

function parseSpecs(product: ProductRow): Record<string, unknown> {
  try {
    return JSON.parse(product.specifications);
  } catch {
    return {};
  }
}

export class BuilderService {
  async validateBuild(selectedComponents: Record<string, string>): Promise<BuildValidationResult> {
    const issues: CompatibilityIssue[] = [];
    let totalEstimatedPrice = 0;
    let lowestTotalPrice = 0;

    const productIds = Object.values(selectedComponents);
    if (productIds.length === 0) {
      return { isCompatible: true, issues: [], totalEstimatedPrice: 0, lowestTotalPrice: 0 };
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { prices: { orderBy: { price: 'asc' } } },
    }) as unknown as ProductRow[];

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const productId of productIds) {
      const product = productMap.get(productId);
      if (!product) continue;
      const prices = product.prices.map((p) => Number(p.price));
      if (prices.length > 0) {
        const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
        totalEstimatedPrice += avg;
        lowestTotalPrice += prices[0];
      }
    }

    // CPU + Motherboard socket check
    const cpuId = selectedComponents['CPU'];
    const mbId = selectedComponents['MOTHERBOARD'];
    if (cpuId && mbId) {
      const cpu = productMap.get(cpuId);
      const mb = productMap.get(mbId);
      if (cpu && mb) {
        const cpuSocket = parseSpecs(cpu)?.socket as string | undefined;
        const mbSocket = parseSpecs(mb)?.socket as string | undefined;
        if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
          issues.push({
            type: 'error',
            message: `CPU socket (${cpuSocket}) is incompatible with motherboard socket (${mbSocket}). Please choose matching components.`,
            components: ['CPU', 'MOTHERBOARD'],
          });
        }
      }
    }

    // PSU wattage warning
    const psuId = selectedComponents['PSU'];
    const gpuId = selectedComponents['GPU'];
    if (psuId && gpuId) {
      const psu = productMap.get(psuId);
      const gpu = productMap.get(gpuId);
      if (psu && gpu) {
        const psuWattage = parseInt((parseSpecs(psu)?.wattage as string) || '0');
        const gpuTdp = parseInt((parseSpecs(gpu)?.tdp as string) || '0');
        const cpuTdp = cpuId ? parseInt(((parseSpecs(productMap.get(cpuId)!))?.tdp as string) || '0') : 0;
        const totalTdp = gpuTdp + cpuTdp + 100;
        if (psuWattage > 0 && psuWattage < totalTdp) {
          issues.push({
            type: 'warning',
            message: `PSU (${psuWattage}W) may be insufficient for your build (~${totalTdp}W estimated). Consider a higher wattage PSU.`,
            components: ['PSU', 'GPU'],
          });
        }
      }
    }

    return {
      isCompatible: !issues.some((i) => i.type === 'error'),
      issues,
      totalEstimatedPrice: Math.round(totalEstimatedPrice),
      lowestTotalPrice: Math.round(lowestTotalPrice),
    };
  }

  async getBuildSummary(selectedComponents: Record<string, string>) {
    const productIds = Object.values(selectedComponents);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        prices: {
          where: { isLowest: true },
          include: { vendor: true },
          take: 1,
        },
      },
    }) as unknown as Array<{
      id: string; category: string; name: string; brand: string;
      prices: Array<{ price: number; vendor: { name: string } }>;
    }>;

    const components = products.map((p) => ({
      category: p.category,
      product: p,
      lowestPrice: p.prices[0] ? { ...p.prices[0], price: Number(p.prices[0].price) } : null,
    }));

    const total = components.reduce((sum: number, c) => sum + (c.lowestPrice?.price || 0), 0);
    return { components, total };
  }
}
