import axios from 'axios';
import { Product, PaginatedResponse, ApiResponse, BuildValidationResult, Vendor } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productsApi = {
  getAll: (params?: Record<string, string | number | undefined>) =>
    api.get<PaginatedResponse<Product>>('/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<Product>>(`/products/${id}`).then((r) => r.data),

  getPrices: (id: string) =>
    api.get<ApiResponse<unknown[]>>(`/products/${id}/prices`).then((r) => r.data),

  getByCategory: (category: string, params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Product>>(`/products/category/${category}`, { params }).then((r) => r.data),

  search: (q: string, params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Product>>('/products/search', { params: { q, ...params } }).then((r) => r.data),
};

export const vendorsApi = {
  getAll: () => api.get<ApiResponse<Vendor[]>>('/vendors').then((r) => r.data),
  getById: (id: string) => api.get<ApiResponse<Vendor>>(`/vendors/${id}`).then((r) => r.data),
};

export const builderApi = {
  validate: (selectedComponents: Record<string, string>) =>
    api.post<ApiResponse<BuildValidationResult>>('/builder/validate', { selectedComponents }).then((r) => r.data),

  getSummary: (selectedComponents: Record<string, string>) =>
    api.post<ApiResponse<unknown>>('/builder/summary', { selectedComponents }).then((r) => r.data),
};

export const aiApi = {
  getBuildAdvice: (params: { currentBuild: Record<string, unknown>; budget: number; useCase: string }) =>
    api.post<ApiResponse<unknown>>('/ai/advisor', params).then((r) => r.data),

  checkCompatibility: (params: { component1: unknown; component2: unknown; issue: string }) =>
    api.post<ApiResponse<{ explanation: string }>>('/ai/compatibility-check', params).then((r) => r.data),
};

export const adminApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ token: string; admin: unknown }>>('/admin/auth/login', { email, password }).then((r) => r.data),

  getProducts: () => api.get<ApiResponse<Product[]>>('/admin/products').then((r) => r.data),
  createProduct: (data: unknown) => api.post<ApiResponse<Product>>('/admin/products', data).then((r) => r.data),
  updateProduct: (id: string, data: unknown) => api.put<ApiResponse<Product>>(`/admin/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id: string) => api.delete<ApiResponse<unknown>>(`/admin/products/${id}`).then((r) => r.data),

  getVendors: () => api.get<ApiResponse<Vendor[]>>('/admin/vendors').then((r) => r.data),
  createVendor: (data: unknown) => api.post<ApiResponse<Vendor>>('/admin/vendors', data).then((r) => r.data),

  overridePrice: (data: unknown) => api.post<ApiResponse<unknown>>('/admin/prices/override', data).then((r) => r.data),
  getPriceLogs: () => api.get<ApiResponse<unknown[]>>('/admin/price-logs').then((r) => r.data),
};

export default api;
