import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/data';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 w-full">
        <div className="relative h-80 w-full overflow-hidden bg-indigo-800 md:absolute md:right-0 md:h-full md:w-1/2 lg:w-2/3">
          <Image
            src="/images/hero/hero-bg.jpg"
            alt="African Fashion"
            className="h-full w-full object-cover object-center"
            width={1920}
            height={1080}
            priority
          />
          <div className="absolute inset-0 bg-indigo-700 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="w-full md:ml-auto md:w-1/2 md:pl-10">
            <h2 className="text-base font-semibold uppercase tracking-wider text-gray-300">
              Premium African Fashion
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Discover Our Latest Collection
            </p>
            <p className="mt-3 text-lg text-gray-300">
              Handcrafted with love and tradition. Explore our unique pieces that celebrate African heritage.
            </p>
            <div className="mt-8">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50"
                >
                  Shop Now
                  <span className="ml-2">→</span>
                </Link>
              </div>
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
