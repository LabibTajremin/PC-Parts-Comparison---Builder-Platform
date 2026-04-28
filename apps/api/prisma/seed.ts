import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const techland = await prisma.vendor.upsert({
    where: { slug: 'techlandbd' },
    update: {},
    create: { name: 'TechlandBD', slug: 'techlandbd', websiteUrl: 'https://www.techlandbd.com', isActive: true },
  });
  const startech = await prisma.vendor.upsert({
    where: { slug: 'startech' },
    update: {},
    create: { name: 'StarTech', slug: 'startech', websiteUrl: 'https://www.startech.com.bd', isActive: true },
  });
  const ryans = await prisma.vendor.upsert({
    where: { slug: 'ryanscomputers' },
    update: {},
    create: { name: 'RyansComputers', slug: 'ryanscomputers', websiteUrl: 'https://www.ryanscomputers.com', isActive: true },
  });
  const vendors = [techland, startech, ryans];

  async function createProduct(data: {
    name: string; slug: string; category: string; brand: string; model: string;
    description: string; specifications: Record<string, unknown>; prices: number[];
  }) {
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        name: data.name, slug: data.slug, category: data.category,
        brand: data.brand, model: data.model, description: data.description,
        specifications: JSON.stringify(data.specifications), isActive: true,
      },
    });
    const minPrice = Math.min(...data.prices);
    for (let i = 0; i < vendors.length; i++) {
      await prisma.vendorPrice.upsert({
        where: { productId_vendorId: { productId: product.id, vendorId: vendors[i].id } },
        update: { price: data.prices[i], isLowest: data.prices[i] === minPrice },
        create: {
          productId: product.id, vendorId: vendors[i].id, price: data.prices[i],
          currency: 'BDT', vendorUrl: `${vendors[i].websiteUrl}/products/${data.slug}`,
          inStock: true, isLowest: data.prices[i] === minPrice,
        },
      });
    }
    return product;
  }

  // CPUs
  const cpu1 = await createProduct({ name: 'Intel Core i5-13600K', slug: 'intel-core-i5-13600k', category: 'CPU', brand: 'Intel', model: 'i5-13600K', description: '14-core Intel 13th Gen processor', specifications: { socket: 'LGA1700', cores: 14, threads: 20, baseClock: '3.5GHz', boostClock: '5.1GHz', tdp: '125W' }, prices: [38500, 37800, 39000] });
  const cpu2 = await createProduct({ name: 'AMD Ryzen 5 7600X', slug: 'amd-ryzen-5-7600x', category: 'CPU', brand: 'AMD', model: 'Ryzen 5 7600X', description: 'AMD Zen 4 6-core processor', specifications: { socket: 'AM5', cores: 6, threads: 12, baseClock: '4.7GHz', boostClock: '5.3GHz', tdp: '105W' }, prices: [32000, 31500, 33000] });
  const cpu3 = await createProduct({ name: 'Intel Core i7-13700K', slug: 'intel-core-i7-13700k', category: 'CPU', brand: 'Intel', model: 'i7-13700K', description: '16-core Intel 13th Gen processor', specifications: { socket: 'LGA1700', cores: 16, threads: 24, baseClock: '3.4GHz', boostClock: '5.4GHz', tdp: '125W' }, prices: [55000, 54200, 56000] });
  const cpu4 = await createProduct({ name: 'AMD Ryzen 7 7700X', slug: 'amd-ryzen-7-7700x', category: 'CPU', brand: 'AMD', model: 'Ryzen 7 7700X', description: 'AMD Zen 4 8-core processor', specifications: { socket: 'AM5', cores: 8, threads: 16, baseClock: '4.5GHz', boostClock: '5.4GHz', tdp: '105W' }, prices: [45000, 44500, 46000] });
  const cpu5 = await createProduct({ name: 'Intel Core i3-13100', slug: 'intel-core-i3-13100', category: 'CPU', brand: 'Intel', model: 'i3-13100', description: 'Budget Intel 13th Gen quad-core', specifications: { socket: 'LGA1700', cores: 4, threads: 8, baseClock: '3.4GHz', boostClock: '4.5GHz', tdp: '60W' }, prices: [14500, 14000, 15000] });

  // Motherboards
  const mb1 = await createProduct({ name: 'ASUS ROG Strix Z790-E Gaming', slug: 'asus-rog-strix-z790-e', category: 'MOTHERBOARD', brand: 'ASUS', model: 'ROG Strix Z790-E', description: 'High-end Z790 for Intel 13th Gen', specifications: { socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX', ramSlots: 4, maxRam: '128GB', ramType: 'DDR5' }, prices: [62000, 61000, 63500] });
  const mb2 = await createProduct({ name: 'MSI MAG B760 Tomahawk WiFi', slug: 'msi-mag-b760-tomahawk', category: 'MOTHERBOARD', brand: 'MSI', model: 'MAG B760 Tomahawk WiFi', description: 'Mid-range B760 with WiFi', specifications: { socket: 'LGA1700', chipset: 'B760', formFactor: 'ATX', ramSlots: 4, maxRam: '128GB', ramType: 'DDR5' }, prices: [28000, 27500, 29000] });
  const mb3 = await createProduct({ name: 'ASUS ROG Crosshair X670E Hero', slug: 'asus-rog-crosshair-x670e', category: 'MOTHERBOARD', brand: 'ASUS', model: 'ROG Crosshair X670E Hero', description: 'Premium X670E for AMD Ryzen 7000', specifications: { socket: 'AM5', chipset: 'X670E', formFactor: 'ATX', ramSlots: 4, maxRam: '128GB', ramType: 'DDR5' }, prices: [75000, 74000, 76500] });
  const mb4 = await createProduct({ name: 'MSI PRO B650-P WiFi', slug: 'msi-pro-b650-p-wifi', category: 'MOTHERBOARD', brand: 'MSI', model: 'PRO B650-P WiFi', description: 'Budget B650 AM5 board with WiFi', specifications: { socket: 'AM5', chipset: 'B650', formFactor: 'ATX', ramSlots: 4, maxRam: '128GB', ramType: 'DDR5' }, prices: [22000, 21500, 23000] });
  const mb5 = await createProduct({ name: 'Gigabyte B760M DS3H', slug: 'gigabyte-b760m-ds3h', category: 'MOTHERBOARD', brand: 'Gigabyte', model: 'B760M DS3H', description: 'Entry-level micro ATX B760', specifications: { socket: 'LGA1700', chipset: 'B760', formFactor: 'mATX', ramSlots: 2, maxRam: '64GB', ramType: 'DDR4' }, prices: [12000, 11500, 12500] });

  // RAM
  await createProduct({ name: 'Corsair Vengeance DDR5-5200 32GB', slug: 'corsair-vengeance-ddr5-5200-32gb', category: 'RAM', brand: 'Corsair', model: 'Vengeance DDR5-5200', description: 'High performance DDR5 32GB kit', specifications: { type: 'DDR5', capacity: '32GB', speed: '5200MHz', modules: '2x16GB', casLatency: 'CL40' }, prices: [18000, 17500, 18500] });
  await createProduct({ name: 'G.Skill Trident Z5 DDR5-6000 32GB', slug: 'gskill-trident-z5-ddr5-6000-32gb', category: 'RAM', brand: 'G.Skill', model: 'Trident Z5 DDR5-6000', description: 'Extreme DDR5 6000MHz 32GB kit', specifications: { type: 'DDR5', capacity: '32GB', speed: '6000MHz', modules: '2x16GB', casLatency: 'CL36' }, prices: [24000, 23500, 24500] });
  await createProduct({ name: 'Kingston Fury Beast DDR4-3200 16GB', slug: 'kingston-fury-beast-ddr4-3200-16gb', category: 'RAM', brand: 'Kingston', model: 'Fury Beast DDR4-3200', description: 'Reliable DDR4 16GB gaming kit', specifications: { type: 'DDR4', capacity: '16GB', speed: '3200MHz', modules: '2x8GB', casLatency: 'CL16' }, prices: [7500, 7200, 7800] });
  await createProduct({ name: 'Corsair Vengeance LPX DDR4-3600 32GB', slug: 'corsair-vengeance-lpx-ddr4-3600-32gb', category: 'RAM', brand: 'Corsair', model: 'Vengeance LPX DDR4-3600', description: 'Low profile DDR4 32GB kit', specifications: { type: 'DDR4', capacity: '32GB', speed: '3600MHz', modules: '2x16GB', casLatency: 'CL18' }, prices: [12500, 12000, 13000] });
  await createProduct({ name: 'Team T-Force Delta DDR5-5600 16GB', slug: 'team-tforce-delta-ddr5-5600-16gb', category: 'RAM', brand: 'Team', model: 'T-Force Delta DDR5-5600', description: 'RGB DDR5 16GB gaming RAM', specifications: { type: 'DDR5', capacity: '16GB', speed: '5600MHz', modules: '2x8GB', casLatency: 'CL36' }, prices: [11000, 10500, 11500] });

  // GPUs
  await createProduct({ name: 'NVIDIA GeForce RTX 4070', slug: 'nvidia-rtx-4070', category: 'GPU', brand: 'NVIDIA', model: 'RTX 4070', description: 'Ada Lovelace 1080p/1440p GPU', specifications: { vram: '12GB GDDR6X', tdp: '200W', busInterface: 'PCIe 4.0 x16' }, prices: [68000, 67000, 70000] });
  await createProduct({ name: 'AMD Radeon RX 7700 XT', slug: 'amd-radeon-rx-7700-xt', category: 'GPU', brand: 'AMD', model: 'RX 7700 XT', description: 'RDNA 3 1440p GPU with 12GB', specifications: { vram: '12GB GDDR6', tdp: '245W', busInterface: 'PCIe 4.0 x16' }, prices: [42000, 41500, 43000] });
  await createProduct({ name: 'NVIDIA GeForce RTX 4060', slug: 'nvidia-rtx-4060', category: 'GPU', brand: 'NVIDIA', model: 'RTX 4060', description: 'Affordable Ada GPU for 1080p', specifications: { vram: '8GB GDDR6', tdp: '115W', busInterface: 'PCIe 4.0 x8' }, prices: [32000, 31500, 33000] });
  await createProduct({ name: 'NVIDIA GeForce RTX 4080 Super', slug: 'nvidia-rtx-4080-super', category: 'GPU', brand: 'NVIDIA', model: 'RTX 4080 Super', description: 'High-end Ada GPU for 4K gaming', specifications: { vram: '16GB GDDR6X', tdp: '320W', busInterface: 'PCIe 4.0 x16' }, prices: [120000, 118000, 122000] });
  await createProduct({ name: 'AMD Radeon RX 7600', slug: 'amd-radeon-rx-7600', category: 'GPU', brand: 'AMD', model: 'RX 7600', description: 'Budget RDNA 3 GPU for 1080p', specifications: { vram: '8GB GDDR6', tdp: '165W', busInterface: 'PCIe 4.0 x8' }, prices: [22000, 21500, 23000] });

  // Storage
  await createProduct({ name: 'Samsung 970 EVO Plus 1TB NVMe', slug: 'samsung-970-evo-plus-1tb', category: 'STORAGE', brand: 'Samsung', model: '970 EVO Plus 1TB', description: 'High-performance PCIe 3.0 NVMe SSD', specifications: { capacity: '1TB', type: 'NVMe SSD', interface: 'PCIe 3.0 x4', readSpeed: '3500MB/s', writeSpeed: '3300MB/s' }, prices: [11000, 10500, 11500] });
  await createProduct({ name: 'WD Black SN850X 1TB NVMe', slug: 'wd-black-sn850x-1tb', category: 'STORAGE', brand: 'Western Digital', model: 'Black SN850X 1TB', description: 'Gen 4 NVMe SSD top performance', specifications: { capacity: '1TB', type: 'NVMe SSD', interface: 'PCIe 4.0 x4', readSpeed: '7300MB/s', writeSpeed: '6300MB/s' }, prices: [14000, 13500, 14500] });
  await createProduct({ name: 'Seagate Barracuda 2TB HDD', slug: 'seagate-barracuda-2tb', category: 'STORAGE', brand: 'Seagate', model: 'Barracuda 2TB', description: 'Large capacity 3.5" hard drive', specifications: { capacity: '2TB', type: 'HDD', interface: 'SATA III', rpm: '7200', cache: '256MB' }, prices: [5500, 5200, 5800] });
  await createProduct({ name: 'Kingston NV2 500GB NVMe', slug: 'kingston-nv2-500gb', category: 'STORAGE', brand: 'Kingston', model: 'NV2 500GB', description: 'Budget NVMe SSD for OS', specifications: { capacity: '500GB', type: 'NVMe SSD', interface: 'PCIe 4.0 x4', readSpeed: '3500MB/s', writeSpeed: '2100MB/s' }, prices: [4500, 4200, 4800] });
  await createProduct({ name: 'Crucial MX500 1TB SATA SSD', slug: 'crucial-mx500-1tb', category: 'STORAGE', brand: 'Crucial', model: 'MX500 1TB', description: 'Reliable SATA SSD', specifications: { capacity: '1TB', type: 'SATA SSD', interface: 'SATA III', readSpeed: '560MB/s', writeSpeed: '510MB/s' }, prices: [8500, 8200, 9000] });

  // PSUs
  await createProduct({ name: 'Corsair RM850x 850W 80+ Gold', slug: 'corsair-rm850x-850w', category: 'PSU', brand: 'Corsair', model: 'RM850x', description: 'Fully modular 850W 80+ Gold PSU', specifications: { wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular' }, prices: [14500, 14000, 15000] });
  await createProduct({ name: 'Seasonic Focus GX-650 650W', slug: 'seasonic-focus-gx-650', category: 'PSU', brand: 'Seasonic', model: 'Focus GX-650', description: 'Modular 650W 80+ Gold PSU', specifications: { wattage: '650W', efficiency: '80+ Gold', modular: 'Fully Modular' }, prices: [11000, 10500, 11500] });
  await createProduct({ name: 'EVGA SuperNOVA 750 G6', slug: 'evga-supernova-750-g6', category: 'PSU', brand: 'EVGA', model: 'SuperNOVA 750 G6', description: '750W fully modular 80+ Gold PSU', specifications: { wattage: '750W', efficiency: '80+ Gold', modular: 'Fully Modular' }, prices: [12000, 11500, 12500] });
  await createProduct({ name: 'Cooler Master MWE Gold 550W', slug: 'coolermaster-mwe-gold-550w', category: 'PSU', brand: 'Cooler Master', model: 'MWE Gold 550W', description: '550W 80+ Gold semi-modular PSU', specifications: { wattage: '550W', efficiency: '80+ Gold', modular: 'Semi-Modular' }, prices: [7000, 6800, 7200] });
  await createProduct({ name: 'Thermaltake Toughpower GF1 1000W', slug: 'thermaltake-toughpower-gf1-1000w', category: 'PSU', brand: 'Thermaltake', model: 'Toughpower GF1 1000W', description: '1000W fully modular 80+ Gold PSU', specifications: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Fully Modular' }, prices: [18000, 17500, 18500] });

  // Cases
  await createProduct({ name: 'Lian Li PC-O11 Dynamic EVO', slug: 'lian-li-pc-o11-dynamic-evo', category: 'CASE', brand: 'Lian Li', model: 'PC-O11 Dynamic EVO', description: 'Premium mid-tower with great airflow', specifications: { formFactor: 'Mid Tower', supportedMB: 'ATX/mATX/E-ATX', maxGPULength: '446mm' }, prices: [16000, 15500, 16500] });
  await createProduct({ name: 'NZXT H510 Flow', slug: 'nzxt-h510-flow', category: 'CASE', brand: 'NZXT', model: 'H510 Flow', description: 'Sleek mid-tower with mesh front', specifications: { formFactor: 'Mid Tower', supportedMB: 'ATX/mATX', maxGPULength: '381mm' }, prices: [10000, 9500, 10500] });
  await createProduct({ name: 'Fractal Design Define 7', slug: 'fractal-design-define-7', category: 'CASE', brand: 'Fractal Design', model: 'Define 7', description: 'Silent mid-tower with sound dampening', specifications: { formFactor: 'Mid Tower', supportedMB: 'ATX/mATX/E-ATX', maxGPULength: '491mm' }, prices: [18000, 17500, 19000] });
  await createProduct({ name: 'Cooler Master Q300L', slug: 'coolermaster-q300l', category: 'CASE', brand: 'Cooler Master', model: 'Q300L', description: 'Compact micro-ATX case', specifications: { formFactor: 'Micro ATX Tower', supportedMB: 'mATX/Mini-ITX', maxGPULength: '360mm' }, prices: [4500, 4200, 4800] });
  await createProduct({ name: 'be quiet! Pure Base 500DX', slug: 'bequiet-pure-base-500dx', category: 'CASE', brand: 'be quiet!', model: 'Pure Base 500DX', description: 'Mid-tower with 3 pre-installed ARGB fans', specifications: { formFactor: 'Mid Tower', supportedMB: 'ATX/mATX', maxGPULength: '369mm' }, prices: [12000, 11500, 12500] });

  // CPU-Motherboard compatibility
  for (const cpu of [cpu1, cpu3, cpu5]) {
    for (const mb of [mb1, mb2, mb5]) {
      await prisma.productCompatibility.upsert({
        where: { baseProductId_compatibleProductId_compatibilityType: { baseProductId: cpu.id, compatibleProductId: mb.id, compatibilityType: 'cpu_socket' } },
        update: {},
        create: { baseProductId: cpu.id, compatibleProductId: mb.id, compatibilityType: 'cpu_socket', isCompatible: true, notes: 'LGA1700 socket match' },
      });
    }
  }
  for (const cpu of [cpu2, cpu4]) {
    for (const mb of [mb3, mb4]) {
      await prisma.productCompatibility.upsert({
        where: { baseProductId_compatibleProductId_compatibilityType: { baseProductId: cpu.id, compatibleProductId: mb.id, compatibilityType: 'cpu_socket' } },
        update: {},
        create: { baseProductId: cpu.id, compatibleProductId: mb.id, compatibilityType: 'cpu_socket', isCompatible: true, notes: 'AM5 socket match' },
      });
    }
  }

  // Admin user
  const passwordHash = await bcrypt.hash('admin123!', 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@pcbuilder.bd' },
    update: {},
    create: { email: 'admin@pcbuilder.bd', passwordHash, name: 'Admin' },
  });

  console.log('Seeding complete!');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
