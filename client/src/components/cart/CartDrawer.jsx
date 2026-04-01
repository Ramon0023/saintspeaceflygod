import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeFromCart, getTotals } = useCartStore();
  const { subtotal, shipping, tax, total } = getTotals();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] glass-panel z-50 flex flex-col border-l border-[rgba(147,51,234,0.3)]"
          >
            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.05)]">
              <h2 className="font-serif italic text-2xl flex items-center gap-2">
                <ShoppingBag className="text-[var(--color-accent)]" /> Your Cart
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <ShoppingBag size={48} className="mb-4 text-[var(--color-text-muted)]" />
                  <p className="font-serif italic text-xl mb-4">Your cart is empty</p>
                  <Button variant="ghost" onClick={() => setIsOpen(false)}>Continue Shopping</Button>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={`${item.product._id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                    <div className="w-20 h-24 bg-black/50 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif italic text-lg leading-tight">{item.product.name}</h3>
                          <div className="text-xs text-[var(--color-text-muted)] mt-1 space-x-2 font-sans">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product._id, item.size, item.color)}
                          className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-[rgba(147,51,234,0.3)] rounded-sm">
                          <button 
                            className="p-1 hover:bg-[rgba(147,51,234,0.1)] transition-colors"
                            onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-sans">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-[rgba(147,51,234,0.1)] transition-colors"
                            onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-sans font-medium">Ksh {item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-[rgba(255,255,255,0.05)] bg-black/40">
                <div className="space-y-2 mb-6 font-sans text-sm">
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Subtotal</span>
                    <span>Ksh {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `Ksh ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Estimated Tax</span>
                    <span>Ksh {tax}</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-[rgba(255,255,255,0.05)] text-lg font-medium">
                    <span>Total</span>
                    <span>Ksh {total}</span>
                  </div>
                </div>
                <Button 
                  className="w-full text-base tracking-widest uppercase"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
