import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (isOpen) => set({ isOpen }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addToCart: (product, size, color, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          item => item.product._id === product._id && item.size === size && item.color === color
        );

        let newItems;
        if (existingItemIndex > -1) {
          newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
        } else {
          newItems = [...items, { product, size, color, quantity }];
        }
        
        set({ items: newItems, isOpen: true });
        toast.success('Added to cart');
      },

      updateQuantity: (productId, size, color, quantity) => {
        const { items } = get();
        if (quantity < 1) return;
        
        const newItems = items.map(item => 
          (item.product._id === productId && item.size === size && item.color === color)
            ? { ...item, quantity } : item
        );
        set({ items: newItems });
      },

      removeFromCart: (productId, size, color) => {
        const { items } = get();
        const newItems = items.filter(item => 
          !(item.product._id === productId && item.size === size && item.color === color)
        );
        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        const shipping = subtotal > 100 || subtotal === 0 ? 0 : 12;
        const tax = Math.round(subtotal * 0.05); // 5% mock tax
        return { subtotal, shipping, tax, total: subtotal + shipping + tax };
      }
    }),
    {
      name: 'spf-cart-storage',
    }
  )
);
