import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[rgba(14,0,26,0.8)] border border-[rgba(147,51,234,0.3)] text-[var(--color-text-primary)]',
    success: 'bg-green-900/50 border border-green-500/50 text-green-200',
    warning: 'bg-yellow-900/50 border border-yellow-500/50 text-yellow-200',
    danger: 'bg-red-900/50 border border-red-500/50 text-red-200',
    accent: 'bg-[var(--color-accent)] text-white'
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-sans font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
