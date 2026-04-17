import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ProductCard from '../components/product/ProductCard';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
        if (res.data.colors?.length) setSelectedColor(res.data.colors[0].name);
        
        // Fetch related products from same collection
        return axios.get(`/api/products?collection=${res.data.collectionName}`);
      })
      .then(res => {
        if (res && res.data) {
          // Filter out current product
          setRelated(res.data.filter(p => p._id !== id && p.slug !== id).slice(0, 4));
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/collections');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    const finalSize = selectedSize || (product.sizes?.length ? product.sizes[0] : 'N/A');
    const finalColor = selectedColor || (product.colors?.length ? product.colors[0].name : 'N/A');
    addToCart(product, finalSize, finalColor, quantity);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--color-accent)]"><Spinner size="lg" /></div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-[4/5] glass-panel overflow-hidden rounded-sm relative"
          >
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-[var(--color-accent)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="font-serif italic text-4xl md:text-5xl mb-4">{product.name}</h1>
            <p className="text-2xl font-sans text-[var(--color-text-muted)] mb-8">Ksh {product.price}</p>
            
            <div className="mb-8">
              <p className="text-[var(--color-text-primary)] leading-relaxed">{product.description}</p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Color: <span className="text-white">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(c => (
                    <button 
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === c.name ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(s => (
                    <button 
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 flex items-center justify-center border transition-all ${
                        selectedSize === s 
                          ? 'border-[var(--color-accent)] bg-[rgba(147,51,234,0.2)] text-white' 
                          : 'border-[rgba(255,255,255,0.2)] text-[var(--color-text-muted)] hover:border-white hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 items-center mt-10">
              <div className="flex items-center border border-[rgba(147,51,234,0.3)] rounded-sm h-12">
                <button 
                  className="px-4 h-full hover:bg-[rgba(147,51,234,0.1)] transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="w-8 text-center text-sm font-sans">{quantity}</span>
                <button 
                  className="px-4 h-full hover:bg-[rgba(147,51,234,0.1)] transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>

              <Button 
                size="lg" 
                className="flex-1 h-12 uppercase tracking-widest"
                onClick={handleAddToCart}
              >
                Add To Cart
              </Button>
            </div>

            <div className="mt-12 text-sm text-[var(--color-text-muted)] space-y-4 border-t border-[rgba(255,255,255,0.05)] pt-8">
              <p>Free global shipping on orders over Ksh 100.</p>
              <p>14-day return policy. No questions asked.</p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-32">
          <h2 className="font-serif italic text-3xl mb-12 border-b border-white/5 pb-4">Synergistic Manifestations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
