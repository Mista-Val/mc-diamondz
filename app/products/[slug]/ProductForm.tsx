'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  price: number;
  colors: Array<{ name: string; bgColor: string }>;
  sizes: Array<{ name: string; inStock: boolean }>;
};

type ProductFormProps = {
  product: Product;
};

export default function ProductForm({ product }: ProductFormProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find((size) => size.inStock)?.name || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      image: '/images/placeholder-product.jpg' // Add appropriate image path
    });
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Color</h3>
        <fieldset className="mt-4">
          <legend className="sr-only">Choose a color</legend>
          <div className="flex items-center space-x-3">
            {product.colors.map((color) => (
              <label
                key={color.name}
                className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${
                  selectedColor === color.name ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="color-choice"
                  value={color.name}
                  checked={selectedColor === color.name}
                  onChange={() => setSelectedColor(color.name)}
                  className="sr-only"
                />
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
                    ? 'cursor-pointer bg-white text-gray-900 shadow-sm hover:bg-gray-50'
                    : 'cursor-not-allowed bg-gray-50 text-gray-200'
                } ${
                  selectedSize === size.name ? 'ring-2 ring-indigo-500' : ''
                } relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase focus:outline-none sm:flex-1`}
                onClick={() => size.inStock && setSelectedSize(size.name)}
              >
                <input
                  type="radio"
                  name="size-choice"
                  value={size.name}
                  disabled={!size.inStock}
                  checked={selectedSize === size.name}
                  onChange={() => {}}
                  className="sr-only"
                />
                {size.inStock ? (
                  <span>{size.name}</span>
                ) : (
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
          Add Selected Item
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
  );
}
