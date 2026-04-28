'use client';

import { ComponentCategory } from '../../types';
import { getCategoryLabel } from '../../lib/utils';

interface FilterState {
  category?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}

interface ProductFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function ProductFilter({ filters, onChange }: ProductFilterProps) {
  const categories = Object.values(ComponentCategory);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      {/* Search */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Search</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search products..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onChange({ ...filters, category: e.target.value || undefined })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Sort By</label>
        <select
          value={filters.sortBy || ''}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value || undefined })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Name (A-Z)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Price Range (BDT)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            placeholder="Min"
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            placeholder="Max"
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={() => onChange({})}
        className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Clear Filters
      </button>
    </div>
  );
}
