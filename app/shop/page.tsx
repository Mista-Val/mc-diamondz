'use client';

import ShopContent from './ShopContent';
import { products } from '@/lib/data';

export default function ShopPage() {
  return <ShopContent products={products} />;
}
