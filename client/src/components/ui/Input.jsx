import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className="mb-1 text-sm text-[var(--color-text-muted)] font-sans">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-[rgba(14,0,26,0.5)] border ${error ? 'border-red-500' : 'border-[rgba(147,51,234,0.2)]'} 
          rounded-sm px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-highlight)] 
          transition-colors backdrop-blur-md`}
        {...props}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
