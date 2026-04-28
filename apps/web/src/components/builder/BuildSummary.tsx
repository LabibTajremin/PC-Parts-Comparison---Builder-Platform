'use client';

import { useBuilderStore } from '../../stores/builderStore';
import { formatPrice, getCategoryLabel } from '../../lib/utils';
import { BUILDER_STEPS } from '../../types';
import CompatibilityAlert from './CompatibilityAlert';

export default function BuildSummary() {
  const { selectedComponents, lowestTotalPrice, compatibilityIssues, checkCompatibility, isChecking, clearBuild } = useBuilderStore();

  const selectedList = BUILDER_STEPS.map((cat) => ({
    category: cat,
    product: selectedComponents[cat],
  }));

  const filledCount = selectedList.filter((s) => s.product).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Build Summary</h3>
        {filledCount > 0 && (
          <button onClick={clearBuild} className="text-xs text-red-500 hover:text-red-700">
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {selectedList.map(({ category, product }) => (
          <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500">{getCategoryLabel(category)}</p>
              {product ? (
                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{product.name}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">Not selected</p>
              )}
            </div>
            {product?.lowestPrice && (
              <span className="text-sm font-bold text-green-600">
                {formatPrice(product.lowestPrice.price)}
              </span>
            )}
          </div>
        ))}
      </div>

      {lowestTotalPrice > 0 && (
        <div className="flex justify-between items-center py-2 mb-4 bg-blue-50 rounded-lg px-3">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-xl text-blue-600">{formatPrice(lowestTotalPrice)}</span>
        </div>
      )}

      {compatibilityIssues.length > 0 && (
        <div className="mb-4">
          <CompatibilityAlert issues={compatibilityIssues} />
        </div>
      )}

      {filledCount >= 2 && (
        <button
          onClick={checkCompatibility}
          disabled={isChecking}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : '✓ Check Compatibility'}
        </button>
      )}

      {filledCount === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">Add components to start building</p>
      )}
    </div>
  );
}
