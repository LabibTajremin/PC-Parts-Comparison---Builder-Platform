import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../lib/api';

export function useProducts(filters?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByCategory(category: string, params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['products', 'category', category, params],
    queryFn: () => productsApi.getByCategory(category, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductSearch(q: string) {
  return useQuery({
    queryKey: ['products', 'search', q],
    queryFn: () => productsApi.search(q),
    enabled: q.length > 2,
    staleTime: 2 * 60 * 1000,
  });
}
