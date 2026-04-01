import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="font-serif italic text-5xl md:text-7xl mb-6">Our Story</h1>
        <div className="w-24 border-b border-[var(--color-accent)] mx-auto"></div>
      </motion.div>

      <div className="space-y-20">
        <section>
          <h2 className="font-serif italic text-3xl mb-6 text-[var(--color-highlight-bright)]">The Genesis</h2>
          <p className="text-[var(--color-text-muted)] leading-loose text-lg">
            Saintspeaceflygod™ was forged in the quiet hours of the night. It represents the duality of existence—the dark void and the divine light. We are an anti-gravity streetwear movement designed for those who refuse to stay tethered to the ground.
          </p>
        </section>

        <section className="glass-panel p-8 md:p-12 relative overflow-hidden">
          <h2 className="brand-name text-4xl mb-6 relative z-10">dream to inspire</h2>
          <p className="text-[var(--color-text-muted)] leading-loose text-lg relative z-10">
            This is not a slogan; it is our operating system. Every thread, every drop, every silhouette is crafted with intention. We dream so that others might realize their own capacity for elevation. We are architects of inspiration, building a wardrobe for the soul.
          </p>
        </section>

        <section>
          <h2 className="font-serif italic text-3xl mb-6 text-[var(--color-highlight-bright)]">The Community</h2>
          <div className="cultural-stamp text-2xl mb-4 text-white">BRAND4THECHLDRN</div>
          <p className="text-[var(--color-text-muted)] leading-loose text-lg">
            We are building a sanctuary for the dreamers. The misfits. The chosen ones. Our pieces are worn like armor against mediocrity. When you wear Saintspeaceflygod™, you carry the culture forward.
          </p>
        </section>
      </div>
    </div>
  );
}
