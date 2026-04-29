import { z } from 'zod';
import { COMPONENT_CATEGORIES } from '../../shared/types';

export const productQuerySchema = z.object({
  query: z.object({
    category: z.enum(COMPONENT_CATEGORIES).optional(),
    brand: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'name']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    category: z.enum(COMPONENT_CATEGORIES),
    brand: z.string().min(1),
    model: z.string().min(1),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
    specifications: z.record(z.unknown()),
    isActive: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    category: z.enum(COMPONENT_CATEGORIES).optional(),
    brand: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    imageUrl: z.string().url().nullable().optional(),
    description: z.string().nullable().optional(),
    specifications: z.record(z.unknown()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const categoryParamSchema = z.object({
  params: z.object({
    category: z.enum(COMPONENT_CATEGORIES),
  }),
});
