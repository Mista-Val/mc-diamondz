'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Animated3DTextProps = {
  text: string;
  className?: string;
};

export function Animated3DText({ text, className = '' }: Animated3DTextProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants for the text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.2,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: '100vw',
      opacity: 0.3,
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  if (!isMounted) return null;

  return (
    <div className={`relative w-full overflow-hidden h-24 ${className}`}>
      <motion.div
        className="absolute whitespace-nowrap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="inline-block mx-8 text-5xl font-bold text-white/20"
            style={{
              textShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)',
              WebkitTextFillColor: 'transparent',
              transformStyle: 'preserve-3d',
            }}
            variants={itemVariants}
          >
            {text}
            <span className="text-indigo-400/50">.</span>
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
