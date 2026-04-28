import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">🖥️ PC Builder BD</h3>
            <p className="text-sm">Compare PC parts prices from top Bangladeshi vendors and build your dream PC.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition">Browse Products</Link></li>
              <li><Link href="/builder" className="hover:text-white transition">PC Builder</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Compare Prices</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li>TechlandBD</li>
              <li>StarTech</li>
              <li>RyansComputers</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>© 2024 PC Builder BD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
