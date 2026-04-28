'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../lib/api';
import { Product } from '../../../types';
import { formatPrice, getCategoryLabel } from '../../../lib/utils';

export default function AdminProductsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => adminApi.getProducts(),
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    await adminApi.deleteProduct(id);
    refetch();
  };

  if (isLoading) return <div>Loading products...</div>;

  const products: Product[] = (data?.data as Product[]) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Brand</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Lowest Price</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-gray-600">{getCategoryLabel(product.category)}</td>
                <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                <td className="px-4 py-3 text-right font-bold text-green-600">
                  {product.lowestPrice ? formatPrice(product.lowestPrice.price) : 'N/A'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
