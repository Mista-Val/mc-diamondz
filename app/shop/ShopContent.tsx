'use client';

import { Filter } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  colors: Array<{ name: string; value: string }>;
  sizes: string[];
};

export const products: Product[] = [
  {
    id: '1',
    name: 'African Print Maxi Dress',
    price: 25000,
    image: '/images/products/dress.jpg',
    category: 'Clothing',
    rating: 4.8,
    reviewCount: 128,
    colors: [
      { name: 'Red', value: '#DC2626' },
      { name: 'Blue', value: '#2563EB' },
      { name: 'Green', value: '#059669' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'Gold Beaded Necklace',
    price: 15000,
    image: '/images/products/necklace.jpg',
    category: 'Jewelry',
    rating: 4.6,
    reviewCount: 89,
    colors: [
      { name: 'Gold', value: '#D4AF37' },
      { name: 'Silver', value: '#C0C0C0' },
    ],
    sizes: ['One Size'],
  },
  {
    id: '3',
    name: 'Ankara Fabric (6 Yards)',
    price: 12000,
    image: '/images/products/Fabric-2.jpeg',
    category: 'Fabrics',
    rating: 4.7,
    reviewCount: 56,
    colors: [
      { name: 'Multicolor', value: 'multicolor' },
    ],
    sizes: ['6 Yards'],
  },
  {
    id: '4',
    name: 'Handbag',
    price: 35000,
    image: '/images/products/handbag.jpg',
    category: 'Accessories',
    rating: 4.9,
    reviewCount: 34,
    colors: [
      { name: 'Brown', value: '#964B00' },
    ],
    sizes: ['One Size'],
  },
  {
    id: '5',
    name: 'Scarf',
    price: 8000,
    image: '/images/products/scarf.jpg',
    category: 'Accessories',
    rating: 4.5,
    reviewCount: 23,
    colors: [
      { name: 'Multicolor', value: 'multicolor' },
    ],
    sizes: ['One Size'],
  },
];

const categories = [
  { name: 'All', href: '#', current: true },
  { name: 'Clothing', href: '#', current: false },
  { name: 'Jewelry', href: '#', current: false },
  { name: 'Fabrics', href: '#', current: false },
  { name: 'Hair', href: '#', current: false },
  { name: 'Accessories', href: '#', current: false },
];

export default function ShopContent({ products: productList }: { products: Product[] }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="pb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shop</h1>
          <p className="mt-4 text-base text-gray-500">
            Browse our collection of authentic African fashion and accessories
          </p>
        </div>

        <div className="pt-12 pb-6 border-t border-gray-200">
          <h2 className="sr-only">Products</h2>

          <div className="flex items-baseline justify-between">
            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                    id="menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <Filter className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                    Filters
                  </button>
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="ml-4 flex items-center space-x-4">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md ${
                        category.current
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {productList.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Pagination */}
        <nav
          className="flex items-center justify-between border-t border-gray-200 px-4 py-6 sm:px-0"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">12</span> of{' '}
              <span className="font-medium">24</span> results
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Next
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
