'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../lib/api';
import { Vendor } from '../../../types';

export default function AdminVendorsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'vendors'],
    queryFn: () => adminApi.getVendors(),
  });

  if (isLoading) return <div>Loading vendors...</div>;

  const vendors: Vendor[] = (data?.data as Vendor[]) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendors ({vendors.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                vendor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {vendor.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <a
              href={vendor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {vendor.websiteUrl}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
