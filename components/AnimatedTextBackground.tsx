'use client';

import { Animated3DText } from './Animated3DText';

export function AnimatedTextBackground() {
  const techTerms = ['JEWELLERY', 'CLOTHING', 'FABRICS', 'HAIR', 'ACCESSORIES', 'FASHION STYLE'];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {techTerms.map((term, index) => (
        <div 
          key={term} 
          className="absolute w-full"
          style={{ top: `${(index + 1) * 15}%` }}
        >
          <Animated3DText text={term} />
        </div>
      ))}
    </div>
  );
}
