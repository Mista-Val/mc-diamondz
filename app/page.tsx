import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/data';
import { AnimatedTextBackground } from '@/components/AnimatedTextBackground';

export default function Home() {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden bg-gray-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <Image
              src="/images/hero/hero-bg.jpg"
              alt="African Fashion"
              className="h-full w-full object-cover object-center"
              fill
              priority
              onError={(e) => {
                // Fallback to a solid background if image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNxYzFmMjEiLz48L3N2Zz4=';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-900/70 mix-blend-multiply" />
          </div>
        </div>

        {/* Animated Text Background */}
        <AnimatedTextBackground />

        {/* Content */}
        <div className="relative z-10 mx-auto h-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40">
          <div className="max-w-2xl lg:mx-0 lg:max-w-xl">
            <p className="text-base font-semibold uppercase tracking-wider text-indigo-400">
              Premium African Fashion
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Elevate Your Style with Authentic African Designs
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover handcrafted pieces that celebrate the rich heritage and vibrant culture of Africa. Each item tells a story of tradition and craftsmanship.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/shop"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Shop Now
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Shop by Category</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
              Discover our curated collection of African fashion and accessories
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Clothing',
                href: '/categories/clothing',
                imageSrc: '/images/categories/clothing.jpg',
              },
              {
                name: 'Jewelry',
                href: '/categories/jewelry',
                imageSrc: '/images/categories/jewelry.jpg',
              },
              {
                name: 'Fabrics',
                href: '/categories/fabrics',
                imageSrc: '/images/categories/fabrics.jpg',
              },
              {
                name: 'Hair',
                href: '/categories/hair',
                imageSrc: '/images/categories/hair.jpg',
              },
            ].map((category) => (
              <div key={category.name} className="group relative">
                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                  <Image
                    src={category.imageSrc}
                    alt={category.name}
                    className="h-full w-full object-cover object-center"
                    width={300}
                    height={300}
                  />
                </div>
                <h3 className="mt-4 text-center text-lg font-medium text-gray-900">
                  <Link href={category.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {category.name}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Products</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
              Handpicked items from our collection
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">₦{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
