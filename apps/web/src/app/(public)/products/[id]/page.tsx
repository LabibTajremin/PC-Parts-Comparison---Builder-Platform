'use client';

import { useProduct } from '../../../../hooks/useProducts';
import PriceTable from '../../../../components/products/PriceTable';
import { formatPrice, getCategoryLabel } from '../../../../lib/utils';
import { useBuilderStore } from '../../../../stores/builderStore';
import { ComponentCategory } from '../../../../types';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useProduct(params.id);
  const { selectComponent, selectedComponents } = useBuilderStore();

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  if (isError || !data?.data) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
      <Link href="/products" className="text-blue-600 hover:underline">Back to Products</Link>
    </div>
  );

  const product = data.data;
  const isSelected = selectedComponents[product.category]?.id === product.id;
  const specs = product.specifications as Record<string, unknown>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        {' / '}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Image */}
        <div className="bg-gray-100 rounded-xl flex items-center justify-center h-72">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain p-4" />
          ) : (
            <span className="text-8xl">
              {product.category === 'CPU' ? '💻' :
               product.category === 'GPU' ? '🎮' :
               product.category === 'RAM' ? '🧠' :
               product.category === 'STORAGE' ? '💾' :
               product.category === 'MOTHERBOARD' ? '🔌' :
               product.category === 'PSU' ? '⚡' : '🖥️'}
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {getCategoryLabel(product.category)}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.brand} — {product.model}</p>

          {product.lowestPrice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Best Price</p>
              <p className="text-3xl font-bold text-green-600">{formatPrice(product.lowestPrice.price)}</p>
              <p className="text-sm text-gray-500">at {product.lowestPrice.vendor?.name}</p>
            </div>
          )}

          <button
            onClick={() => selectComponent(product.category as ComponentCategory, product)}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isSelected ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSelected ? '✓ Added to Build' : 'Add to My Build'}
          </button>

          {product.description && (
            <p className="text-gray-600 text-sm mt-4">{product.description}</p>
          )}
        </div>
      </div>

      {/* Specifications */}
      {Object.keys(specs).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd className="font-medium text-gray-900">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Price comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Price Comparison</h2>
        <PriceTable prices={product.prices || []} />
      </div>
    </div>
  );
}
