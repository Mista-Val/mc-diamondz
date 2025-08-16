import { StarIcon } from '@heroicons/react/20/solid';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ProductDetail() {
  // In a real app, this would be fetched from an API
  const product = {
    name: 'African Print Maxi Dress',
    price: '₦25,000',
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
        <li>• Flattering A-line silhouette with a defined waist</n        <li>• Comfortable and breathable cotton material</li>
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
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
                  >
                    <Image
                      src={`/images/product-${i}.jpg`}
                      alt={`Product image ${i}`}
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
                src="/images/product-1.jpg"
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
              <p className="text-3xl tracking-tight text-gray-900">{product.price}</p>
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

            <form className="mt-6">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                <fieldset className="mt-4">
                  <legend className="sr-only">Choose a color</legend>
                  <div className="flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <label
                        key={color.name}
                        className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ring-gray-400`}
                      >
                        <input type="radio" name="color-choice" value={color.name} className="sr-only" />
                        <span
                          aria-hidden="true"
                          className={`h-8 w-8 rounded-full border border-black border-opacity-10 ${color.bgColor}`}
                        />
                        <span className="sr-only">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Size guide
                  </a>
                </div>

                <fieldset className="mt-4">
                  <legend className="sr-only">Choose a size</legend>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    {product.sizes.map((size) => (
                      <div
                        key={size.name}
                        className={`${
                          size.inStock
                            ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                            : 'cursor-not-allowed bg-gray-50 text-gray-200'
                        } group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1`}
                      >
                        <input
                          type="radio"
                          name="size-choice"
                          value={size.name}
                          disabled={!size.inStock}
                          className="sr-only"
                        />
                        {size.inStock && (
                          <span>{size.name}</span>
                        )}
                        {!size.inStock && (
                          <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                            <svg
                              className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              stroke="currentColor"
                            >
                              <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Add to bag
                </button>

                <button
                  type="button"
                  className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </form>

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
