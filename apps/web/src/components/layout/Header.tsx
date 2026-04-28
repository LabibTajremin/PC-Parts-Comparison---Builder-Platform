'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBuilderStore } from '../../stores/builderStore';
import { cn } from '../../lib/utils';

export default function Header() {
  const pathname = usePathname();
  const selectedCount = Object.keys(useBuilderStore((s) => s.selectedComponents)).length;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/compare', label: 'Compare' },
    { href: '/builder', label: 'PC Builder' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          🖥️ PC Builder BD
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition',
                pathname === link.href
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/builder"
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            My Build
            {selectedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
