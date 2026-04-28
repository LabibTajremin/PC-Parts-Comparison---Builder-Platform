import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Build Your Dream PC</h1>
          <p className="text-xl mb-8 text-blue-100">
            Compare prices from top Bangladeshi vendors and build your custom PC step-by-step
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/builder"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Start Building
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Parts
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Use PC Parts Builder?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '💰',
              title: 'Best Prices',
              desc: 'Compare prices from TechlandBD, StarTech, and RyansComputers to find the best deal.',
            },
            {
              icon: '🔧',
              title: 'Compatibility Check',
              desc: 'Our AI-powered compatibility checker ensures all your parts work together.',
            },
            {
              icon: '🤖',
              title: 'AI Advisor',
              desc: 'Get personalized build recommendations based on your budget and use case.',
            },
          ].map((f) => (
            <div key={f.title} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'CPU', emoji: '💻', href: '/products?category=CPU' },
              { name: 'GPU', emoji: '🎮', href: '/products?category=GPU' },
              { name: 'RAM', emoji: '🧠', href: '/products?category=RAM' },
              { name: 'Storage', emoji: '💾', href: '/products?category=STORAGE' },
              { name: 'Motherboard', emoji: '🔌', href: '/products?category=MOTHERBOARD' },
              { name: 'PSU', emoji: '⚡', href: '/products?category=PSU' },
              { name: 'Case', emoji: '🖥️', href: '/products?category=CASE' },
              { name: 'All Parts', emoji: '🔍', href: '/products' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center p-6 bg-white rounded-xl hover:shadow-md transition border border-gray-200"
              >
                <span className="text-4xl mb-2">{cat.emoji}</span>
                <span className="font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to build?</h2>
        <p className="text-gray-600 mb-8">Our step-by-step builder guides you through selecting compatible components.</p>
        <Link
          href="/builder"
          className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition inline-block"
        >
          Start PC Builder
        </Link>
      </section>
    </div>
  );
}
