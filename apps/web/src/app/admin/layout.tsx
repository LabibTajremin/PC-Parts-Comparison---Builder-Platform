'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (!isAuth) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-gray-700 text-sm">Dashboard</Link>
          <Link href="/admin/products" className="px-3 py-2 rounded-lg hover:bg-gray-700 text-sm">Products</Link>
          <Link href="/admin/vendors" className="px-3 py-2 rounded-lg hover:bg-gray-700 text-sm">Vendors</Link>
        </nav>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-white mt-4">Logout</button>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
