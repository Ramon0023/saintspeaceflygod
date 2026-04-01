import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const variants = {
    rectangular: 'rounded-sm',
    circular: 'rounded-full',
    text: 'rounded-sm h-4'
  };

  return (
    <div 
      className={`animate-pulse bg-[rgba(147,51,234,0.1)] ${variants[variant]} ${className}`}
    />
  );
}
