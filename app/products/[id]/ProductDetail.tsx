'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageSrc: product.images?.[0] || '',
      quantity,
    });
  };

  if (!product) return null;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 w-full overflow-hidden rounded-md ${
                        selectedImage === index ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                        width={200}
                        height={200}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Image */}
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
              <Image
                src={product.images?.[selectedImage] || '/images/placeholder.jpg'}
                alt={product.name}
                className="h-full w-full object-cover object-center transition duration-300 ease-in-out hover:opacity-90"
                width={1200}
                height={1600}
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-light tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl tracking-tight text-gray-900">
                ₦{product.price.toLocaleString()}
              </p>
              {product.compareAtPrice && (
                <p className="text-sm text-gray-500 line-through">
                  ₦{product.compareAtPrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* Color Picker */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-2 flex space-x-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      className="h-8 w-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Picker */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className="flex h-10 items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="mt-2">
                <select
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-10 flex">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  product.inStock
                    ? 'bg-black hover:bg-gray-800 focus:ring-gray-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to cart' : 'Out of stock'}
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                <div className="prose prose-sm mt-4 text-gray-500">
                  <p>{product.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
