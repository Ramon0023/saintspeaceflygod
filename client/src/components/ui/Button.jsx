import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-sans font-medium rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-highlight)]",
    secondary: "bg-[rgba(14,0,26,0.6)] border border-[var(--color-accent)] text-[var(--color-text-primary)] hover:bg-[var(--color-purple-800)]",
    ghost: "bg-transparent text-[var(--color-text-primary)] hover:text-[var(--color-highlight-bright)] hover:bg-[rgba(14,0,26,0.4)]",
    gold: "bg-[var(--color-gold)] text-black hover:bg-yellow-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg"
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2 border-2 border-current border-t-transparent rounded-full w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
}
