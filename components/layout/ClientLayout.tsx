'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

const Cart = dynamic(() => import('@/components/cart/Cart'), { ssr: false });

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <Cart open={isCartOpen} setOpen={setIsCartOpen} />
    </CartProvider>
  );
}
