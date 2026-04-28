'use client';

import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilter from '../../../components/products/ProductFilter';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || undefined,
    sortBy: undefined as string | undefined,
    minPrice: undefined as string | undefined,
    maxPrice: undefined as string | undefined,
    search: undefined as string | undefined,
  });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({
    ...filters,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    page,
    limit: 20,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">PC Components</h1>
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <ProductFilter
            filters={filters}
            onChange={(f) => { setFilters(f as typeof filters); setPage(1); }}
          />
        </aside>

        {/* Products */}
        <div className="flex-1">
          {data && (
            <p className="text-sm text-gray-500 mb-4">
              Showing {data.data.length} of {data.total} products
            </p>
          )}
          <ProductGrid products={data?.data || []} loading={isLoading} showAddToBuild />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
