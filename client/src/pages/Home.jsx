import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import axios from 'axios';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    document.title = 'Saintspeaceflygod™ | dream to inspire';
    // Fetch some products for featured
    axios.get('/api/products?limit=4')
      .then(res => setFeatured(res.data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section — image is the size anchor; all content floats above it */}
      <section className="relative w-full text-center">
        {/* The image drives the section height and is fully visible (portrait 5:6) */}
        <img
          src="/hero-bg.jpg"
          alt="Hero background"
          className="w-full h-auto block"
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* All content centered over the image */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h1 className="brand-name text-5xl md:text-7xl lg:text-9xl mb-4 text-white">
              Saintspeaceflygod™
            </h1>
            <p className="motto text-lg md:text-2xl text-[var(--color-text-primary)] tracking-widest">
              dream to inspire
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10"
          >
            <div className="cultural-stamp text-sm md:text-base text-white opacity-90 mb-6 font-bold">
              BRAND4THECHLDRN
            </div>
            <Link to="/collections">
              <Button size="lg" className="px-10 py-4 text-sm tracking-widest uppercase bg-[var(--color-accent)] text-white hover:bg-[var(--color-highlight)]">
                Enter the void
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 px-4 md:px-8 container mx-auto">
        <h2 className="font-serif italic text-3xl md:text-4xl text-center mb-12">The Chosen Ones</h2>
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {featured.map(product => (
            <div key={product._id} className="min-w-[280px] md:min-w-[320px] snap-center group">
              <Link to={`/product/${product.slug || product._id}`}>
                <div className="relative overflow-hidden glass-panel aspect-[4/5] rounded-sm mb-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <Button variant="secondary" size="sm" className="w-[80%] uppercase tracking-widest text-xs pointer-events-auto">
                      Quick Add
                    </Button>
                  </div>
                </div>
                <h3 className="font-serif text-xl italic hover:text-[var(--color-highlight)] transition-colors">{product.name}</h3>
                <p className="text-[var(--color-text-muted)] font-sans">Ksh {product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Story Teaser */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[var(--color-purple-900)] opacity-50 skew-y-3 transform origin-bottom-left z-0"></div>
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-square glass-panel overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=800&auto=format&fit=crop" 
              alt="Editorial fashion" 
              className="w-full h-full object-cover opacity-70"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif italic text-4xl mb-6">Born from the ether.</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
              Saintspeaceflygod™ is more than fabric—it is an ascension. We exist at the intersection of dark atmospheric aesthetics and spiritual elevation. The garments are manifestations of a whispered mantra, designed to elevate the children of tomorrow.
            </p>
            <Link to="/about">
              <Button variant="ghost" className="border-b border-[var(--color-accent)] rounded-none px-0 py-1">
                Read the Manifesto
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
