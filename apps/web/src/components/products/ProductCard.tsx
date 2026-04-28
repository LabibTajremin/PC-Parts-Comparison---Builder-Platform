'use client';

import Link from 'next/link';
import { Product, ComponentCategory } from '../../types';
import { formatPrice, getCategoryLabel } from '../../lib/utils';
import { useBuilderStore } from '../../stores/builderStore';

interface ProductCardProps {
  product: Product;
  showAddToBuild?: boolean;
  onSelect?: (product: Product) => void;
}

export default function ProductCard({ product, showAddToBuild, onSelect }: ProductCardProps) {
  const { selectComponent, selectedComponents } = useBuilderStore();
  const isSelected = selectedComponents[product.category]?.id === product.id;

  const lowestPrice = product.lowestPrice;
  const prices = product.prices || [];
  const maxPrice = prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : 0;

  const handleAddToBuild = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      selectComponent(product.category as ComponentCategory, product);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Image placeholder */}
      <div className="bg-gray-100 h-48 flex items-center justify-center">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-4" />
        ) : (
          <span className="text-5xl">
            {product.category === 'CPU' ? '💻' :
             product.category === 'GPU' ? '🎮' :
             product.category === 'RAM' ? '🧠' :
             product.category === 'STORAGE' ? '💾' :
             product.category === 'MOTHERBOARD' ? '🔌' :
             product.category === 'PSU' ? '⚡' : '🖥️'}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {getCategoryLabel(product.category)}
          </span>
          <span className="text-xs text-gray-500">{product.brand}</span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2 mb-2">
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-auto">
          {lowestPrice ? (
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-green-600">{formatPrice(lowestPrice.price, lowestPrice.currency)}</span>
                <span className="text-xs text-gray-500">at {lowestPrice.vendor?.name}</span>
              </div>
              {prices.length > 1 && (
                <p className="text-xs text-gray-500">
                  Range: {formatPrice(lowestPrice.price)} – {formatPrice(maxPrice)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-3">No price available</p>
          )}

          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}`}
              className="flex-1 text-center text-sm border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              View Prices
            </Link>
            {showAddToBuild && (
              <button
                onClick={handleAddToBuild}
                className={`flex-1 text-sm py-2 rounded-lg transition font-medium ${
                  isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSelected ? '✓ Added' : 'Add to Build'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
