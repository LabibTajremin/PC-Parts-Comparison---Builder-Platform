'use client';

import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { Product, ComponentCategory } from '../../../types';
import { formatPrice, getCategoryLabel } from '../../../lib/utils';
import PriceTable from '../../../components/products/PriceTable';

export default function ComparePage() {
  const [category, setCategory] = useState<ComponentCategory>(ComponentCategory.CPU);
  const [selected, setSelected] = useState<Product[]>([]);

  const { data } = useProducts({ category, limit: 50 });

  const toggleProduct = (product: Product) => {
    if (selected.find((p) => p.id === product.id)) {
      setSelected(selected.filter((p) => p.id !== product.id));
    } else if (selected.length < 3) {
      setSelected([...selected, product]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Price Comparison</h1>
      <p className="text-gray-500 mb-6">Select up to 3 products to compare prices</p>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.values(ComponentCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSelected([]); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
              category === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Product selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">
            Select Products ({selected.length}/3 selected)
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {data?.data.map((product) => {
              const isSelected = !!selected.find((p) => p.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    {product.lowestPrice && (
                      <p className="font-bold text-green-600 text-sm">{formatPrice(product.lowestPrice.price)}</p>
                    )}
                    {isSelected && <p className="text-xs text-blue-600">✓ Selected</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison table */}
        <div>
          {selected.length > 0 ? (
            <div className="space-y-6">
              {selected.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                    <button
                      onClick={() => toggleProduct(product)}
                      className="text-red-500 text-xs hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <PriceTable prices={product.prices || []} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">Select products to compare</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
