import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Product Image */}
          <div className="flex flex-col-reverse">
            <div className="aspect-h-1 aspect-w-1 w-full">
              <Image
                src={product.imageSrc}
                alt={product.name}
                className="h-full w-full object-cover object-center sm:rounded-lg"
                width={600}
                height={800}
                priority
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                <p>{product.description || 'No description available.'}</p>
              </div>
            </div>

            <div className="mt-10 flex">
              <button
                type="submit"
                className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
