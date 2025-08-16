import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Cart = dynamic(() => import('@/components/cart/Cart'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'M.C Diamondz Fashion Emporium',
  description: 'Your premier destination for African fashion, jewelry, and accessories',
  keywords: 'African fashion, Jewelry, African clothing, Fashion accessories, African prints',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar onCartClick={() => setIsCartOpen(true)} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Cart open={isCartOpen} setOpen={setIsCartOpen} />
        </CartProvider>
      </body>
    </html>
  );
}
