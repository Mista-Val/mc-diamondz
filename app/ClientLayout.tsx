'use client';

import { useState, type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Cart from '@/components/cart/Cart';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar onCartClick={() => setIsCartOpen(true)} />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
          <Cart open={isCartOpen} setOpen={setIsCartOpen} />
        </CartProvider>
      </body>
    </html>
  );
}
