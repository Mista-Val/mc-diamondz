'use client';

import { useState, useEffect } from 'react';
import { usePathname, notFound } from 'next/navigation';
import ShopContent from '@/app/shop/ShopContent';
import { products, Product } from '@/lib/data';

export default function CategoryPage() {
  const pathname = usePathname();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    try {
      setIsLoading(true);
      const slug = pathname.split('/').pop();
      
      if (!slug) {
        throw new Error('Invalid category URL');
      }

      const decodedSlug = decodeURIComponent(slug).toLowerCase();
      const filtered = products.filter(
        (p) => p.category.toLowerCase() === decodedSlug
      );

      if (filtered.length === 0) {
        throw new Error('No products found in this category');
      }

      setFilteredProducts(filtered);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {filteredProducts[0]?.category || 'Category'}
      </h1>
      <ShopContent products={filteredProducts} />
    </div>
  );
}
