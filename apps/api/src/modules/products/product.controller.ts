import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { AppError } from '../../middleware/error.middleware';
import { ComponentCategory } from '@prisma/client';

const service = new ProductService();

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, brand, minPrice, maxPrice, sortBy, page, limit, search } = req.query as Record<string, string>;
    const result = await service.getProducts({
      category: category as ComponentCategory | undefined,
      brand,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy as 'price_asc' | 'price_desc' | 'name' | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.getProductById(req.params.id);
    if (!product) throw new AppError(404, 'Product not found');
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function getProductPrices(req: Request, res: Response, next: NextFunction) {
  try {
    const prices = await service.getProductPrices(req.params.id);
    res.json({ success: true, data: prices });
  } catch (err) {
    next(err);
  }
}

export async function getProductsByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.params;
    const { page, limit, sortBy } = req.query as Record<string, string>;
    const result = await service.getProducts({
      category: category as ComponentCategory,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy as 'price_asc' | 'price_desc' | 'name' | undefined,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function searchProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, page, limit } = req.query as Record<string, string>;
    const result = await service.getProducts({
      search: q,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
