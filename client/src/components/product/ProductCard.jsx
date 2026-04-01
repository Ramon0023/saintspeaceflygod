import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore(state => state.addToCart);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0] || 'M';
    const color = product.colors?.[0]?.name || 'Default';
    addToCart(product, size, color, 1);
  };

  return (
    <div className="group w-full max-w-sm mx-auto">
      <Link to={`/product/${product.slug || product._id}`} className="block">
        <div className="relative overflow-hidden glass-panel aspect-[4/5] rounded-sm mb-4">
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/400x500'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-[80%] uppercase tracking-widest text-xs pointer-events-auto"
              onClick={handleQuickAdd}
            >
              Quick Add
            </Button>
          </div>
        </div>
        <h3 className="font-serif text-xl italic hover:text-[var(--color-highlight)] transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-[var(--color-text-muted)] font-sans">Ksh {product.price}</p>
      </Link>
    </div>
  );
}
