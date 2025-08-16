import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'M.C Diamondz Fashion Emporium',
  description: 'Your premier destination for African fashion, jewelry, and accessories',
  keywords: 'African fashion, Jewelry, African clothing, Fashion accessories, African prints',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
