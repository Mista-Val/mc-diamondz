import { StarIcon } from '@heroicons/react/20/solid';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const ProductForm = dynamic(() => import('./ProductForm'), { ssr: false });

export default function ProductDetail() {
  // In a real app, this would be fetched from an API
  const product = {
    name: 'African Print Maxi Dress',
    price: 25000,
    rating: 4.8,
    reviewCount: 128,
    href: '#',
    colors: [
      { name: 'Black', bgColor: 'bg-gray-900', selectedColor: 'ring-gray-900' },
      { name: 'Red', bgColor: 'bg-red-700', selectedColor: 'ring-red-700' },
      { name: 'Blue', bgColor: 'bg-blue-700', selectedColor: 'ring-blue-700' },
    ],
    sizes: [
      { name: 'S', inStock: true },
      { name: 'M', inStock: true },
      { name: 'L', inStock: true },
      { name: 'XL', inStock: true },
      { name: '2XL', inStock: true },
      { name: '3XL', inStock: false },
    ],
    description: `
      <p>This stunning African print maxi dress is made from 100% premium cotton Ankara fabric. The vibrant colors and traditional patterns make it a perfect choice for any special occasion or casual outing.</p>
      <p>Features:</p>
      <ul>
        <li>• Made with authentic African wax print fabric</li>
        <li>• Flattering A-line silhouette with a defined waist</li>
        <li>• Comfortable and breathable cotton material</li>
        <li>• Handcrafted with attention to detail</li>
        <li>• Machine washable (cold water, gentle cycle)</li>
      </ul>
    `,
    details: [
      '100% Cotton',
      'Made in Nigeria',
      'Hand wash with cold water',
      'Line dry in shade',
      'Iron on low heat',
    ],
    highlights: [
      '100% Cotton',
      'Made in Nigeria',
      'Hand wash with cold water',
      'Line dry in shade',
      'Iron on low heat',
    ],
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {['product-1', 'necklace', 'handbag', 'scarf'].map((imageName, i) => (
                  <div
                    key={i}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
                  >
                    <Image
                      src={`/products/${imageName}.jpg`}
                      alt={`Product image ${i + 1}`}
                      className="h-full w-full object-cover object-center"
                      width={200}
                      height={200}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="aspect-h-1 aspect-w-1 w-full">
              <Image
                src={`/products/${product.name.toLowerCase().replace(' ', '-')}.jpg`}
                alt={product.name}
                className="h-full w-full object-cover object-center sm:rounded-lg"
                width={800}
                height={800}
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">{product.price.toLocaleString()}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${
                        product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {product.reviewCount} reviews
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Product form - Client Component */}
            <ProductForm product={product} />

            {/* Product details */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <section className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Fabric & Care</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.details.map((item) => (
                    <li key={item} className="text-gray-600">
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Free standard shipping on all orders within Nigeria. International shipping available.
                  Easy 14-day returns for store credit or exchange.
                </p>
              </div>
            </section>

            <div className="mt-6">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <p className="ml-2 text-sm text-gray-500">
                  Secure checkout with multiple payment options including card, bank transfer, and mobile money.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Product Detail',
  description: 'Product detail page',
};
