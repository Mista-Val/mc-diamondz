'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';
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
    image: '/images/products/Fabric-1.jpeg',
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
    name: 'Leather Handbag',
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
    name: 'African Print Scarf',
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
  {
    id: '6',
    name: 'Braided Wig',
    price: 28000,
    image: '/images/products/hair-1.jpg',
    category: 'Hair',
    rating: 4.7,
    reviewCount: 42,
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Brown', value: '#8B4513' },
    ],
    sizes: ['One Size'],
  },
  {
    id: '7',
    name: 'African Print Shirt',
    price: 18000,
    image: '/images/products/dress-2.jpg',
    category: 'Clothing',
    rating: 4.5,
    reviewCount: 67,
    colors: [
      { name: 'Multicolor', value: 'multicolor' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '8',
    name: 'Beaded Necklace Set',
    price: 22000,
    image: '/images/products/necklace-2.jpg',
    category: 'Jewelry',
    rating: 4.8,
    reviewCount: 31,
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
  const [activeCategory, setActiveCategory] = useState('All');

  const normalizeCategory = (category: string) => category.toLowerCase().trim();

  const filteredProducts = activeCategory === 'All' 
    ? productList 
    : productList.filter(product => 
        normalizeCategory(product.category) === normalizeCategory(activeCategory)
      );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="pb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Discover African Elegance
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Handcrafted pieces that celebrate rich cultural heritage
          </p>
        </div>

        <div className="pt-12 pb-6 border-t border-gray-100">
          <h2 className="sr-only">Products</h2>

          <div className="flex items-baseline justify-between">
            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="group inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200"
                    id="menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <Filter className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    Filters
                  </button>
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="ml-4 flex items-center space-x-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-xl border border-gray-100 shadow-sm">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setActiveCategory(category.name)}
                      className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeCategory === category.name
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 pb-16">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <ProductCard {...product} />
            </div>
          ))}
        </div>

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
