'use client';

import { ComponentCategory, Product } from '../../types';
import { useProductsByCategory } from '../../hooks/useProducts';
import { useBuilderStore } from '../../stores/builderStore';
import { getCategoryLabel, formatPrice } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface ComponentSelectorProps {
  category: ComponentCategory;
}

export default function ComponentSelector({ category }: ComponentSelectorProps) {
  const { data, isLoading } = useProductsByCategory(category, { limit: 20, sortBy: 'price_asc' });
  const { selectComponent, selectedComponents } = useBuilderStore();

  const selected = selectedComponents[category];

  const handleSelect = (product: Product) => {
    selectComponent(category, product);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Select {getCategoryLabel(category)}
        {selected && (
          <span className="ml-3 text-sm font-normal text-green-600">✓ {selected.name}</span>
        )}
      </h2>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-xl" />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {data?.data.map((product) => {
          const isChosen = selected?.id === product.id;
          return (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-xl border text-left transition',
                isChosen
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                  {category === 'CPU' ? '💻' : category === 'GPU' ? '🎮' : category === 'RAM' ? '🧠' :
                   category === 'STORAGE' ? '💾' : category === 'MOTHERBOARD' ? '🔌' :
                   category === 'PSU' ? '⚡' : '🖥️'}
                </div>
                <div>
                  <p className={cn('font-medium', isChosen ? 'text-green-900' : 'text-gray-900')}>
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {Object.entries(product.specifications as Record<string, unknown>)
                      .slice(0, 3)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' · ')}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                {product.lowestPrice ? (
                  <>
                    <p className="font-bold text-green-600">{formatPrice(product.lowestPrice.price)}</p>
                    <p className="text-xs text-gray-500">{product.lowestPrice.vendor?.name}</p>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">N/A</p>
                )}
                {isChosen && <p className="text-xs text-green-600 mt-1">✓ Selected</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
