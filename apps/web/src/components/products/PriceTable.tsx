'use client';

import { VendorPrice } from '../../types';
import { formatPrice, formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface PriceTableProps {
  prices: VendorPrice[];
}

export default function PriceTable({ prices }: PriceTableProps) {
  if (!prices || prices.length === 0) {
    return <p className="text-gray-500 text-sm">No price data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Vendor</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
            <th className="text-center px-4 py-3 font-medium text-gray-600">Stock</th>
            <th className="text-center px-4 py-3 font-medium text-gray-600">Updated</th>
            <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr
              key={price.id}
              className={cn(
                'border-b transition',
                price.isLowest ? 'bg-green-50' : 'hover:bg-gray-50'
              )}
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {price.vendor?.name || price.vendorId}
                {price.isLowest && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Best Price</span>
                )}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatPrice(price.price, price.currency)}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  price.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
                  {price.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-gray-500">
                {price.isStale && (
                  <span className="text-yellow-600 text-xs mr-1">⚠ Stale</span>
                )}
                {formatDate(price.lastUpdated)}
              </td>
              <td className="px-4 py-3 text-center">
                <a
                  href={price.vendorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-xs px-3 py-1.5 rounded font-medium transition',
                    price.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  )}
                  onClick={(e) => {
                    if (!price.inStock) e.preventDefault();
                    // Sanitize: only allow http/https
                    try {
                      const url = new URL(price.vendorUrl);
                      if (!['http:', 'https:'].includes(url.protocol)) e.preventDefault();
                    } catch {
                      e.preventDefault();
                    }
                  }}
                >
                  Buy Now
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
