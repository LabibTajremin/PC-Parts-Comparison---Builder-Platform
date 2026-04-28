// Component Categories
export enum ComponentCategory {
  CPU = 'CPU',
  GPU = 'GPU',
  RAM = 'RAM',
  STORAGE = 'STORAGE',
  MOTHERBOARD = 'MOTHERBOARD',
  PSU = 'PSU',
  CASE = 'CASE',
}

// Product Types
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

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pricing Types
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
  product?: Product;
}

// Builder Types
export interface SelectedComponents {
  [ComponentCategory.CPU]?: Product;
  [ComponentCategory.GPU]?: Product;
  [ComponentCategory.RAM]?: Product;
  [ComponentCategory.STORAGE]?: Product;
  [ComponentCategory.MOTHERBOARD]?: Product;
  [ComponentCategory.PSU]?: Product;
  [ComponentCategory.CASE]?: Product;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning';
  message: string;
  components: ComponentCategory[];
}

export interface BuildValidationResult {
  isCompatible: boolean;
  issues: CompatibilityIssue[];
  totalEstimatedPrice: number;
  lowestTotalPrice: number;
}

// AI Types
export interface BuildAdviceSuggestion {
  category: ComponentCategory;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface BuildAdvice {
  advice: string;
  suggestions: BuildAdviceSuggestion[];
  warnings: string[];
  estimatedBudgetRange: {
    min: number;
    max: number;
    currency: string;
  };
}

// API Response Types
export interface PaginatedResponse<T> {
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
  message?: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin?: string | null;
}

export interface PriceUpdateLog {
  id: string;
  vendorId: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  productsUpdated: number;
  errorMessage?: string | null;
  startedAt: string;
  completedAt?: string | null;
}

// Query filter types
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
