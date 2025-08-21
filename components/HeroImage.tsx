'use client';

import Image from 'next/image';

export default function HeroImage() {
  return (
    <Image
      src="/images/hero/hero-bg.jpg"
      alt="African Fashion"
      className="h-full w-full object-cover object-center"
      fill
      priority
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNxYzFmMjEiLz48L3N2Zz4=';
      }}
    />
  );
}
