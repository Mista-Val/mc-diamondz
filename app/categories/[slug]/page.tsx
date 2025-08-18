'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ShopContent from '@/app/shop/ShopContent';
import { products, Product } from '@/lib/data';

export default function CategoryPage() {
  const pathname = usePathname();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (pathname) {
      const slug = pathname.split('/').pop();
      const filteredProducts = products.filter(
        (p) => p.category.toLowerCase() === slug.toLowerCase()
      );
      setFilteredProducts(filteredProducts);
    }
  }, [pathname]);

  return (
    <div>
      <ShopContent products={filteredProducts} />
    </div>
  );
}
