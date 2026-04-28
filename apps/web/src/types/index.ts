export enum ComponentCategory {
  CPU = 'CPU',
  GPU = 'GPU',
  RAM = 'RAM',
  STORAGE = 'STORAGE',
  MOTHERBOARD = 'MOTHERBOARD',
  PSU = 'PSU',
  CASE = 'CASE',
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl?: string | null;
  isActive: boolean;
}

export interface VendorPrice {
  id: string;
  productId: string;
  vendorId: string;
  price: number;
  currency: string;
  vendorUrl: string;
  inStock: boolean;
  isLowest: boolean;
  lastUpdated: string;
  isStale: boolean;
  vendor?: Vendor;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ComponentCategory;
  brand: string;
  model: string;
  imageUrl?: string | null;
  description?: string | null;
  specifications: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  prices?: VendorPrice[];
  lowestPrice?: VendorPrice | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

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

export type SelectedComponents = Partial<Record<ComponentCategory, Product>>;

export const BUILDER_STEPS: ComponentCategory[] = [
  ComponentCategory.CPU,
  ComponentCategory.MOTHERBOARD,
  ComponentCategory.RAM,
  ComponentCategory.GPU,
  ComponentCategory.STORAGE,
  ComponentCategory.PSU,
  ComponentCategory.CASE,
];
