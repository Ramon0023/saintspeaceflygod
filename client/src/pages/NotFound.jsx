import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="brand-name text-7xl md:text-9xl mb-6 text-[var(--color-highlight)] opacity-50">404</h1>
        <h2 className="font-serif italic text-3xl md:text-5xl mb-6 text-white">The Void Responds with Silence</h2>
        <p className="text-[var(--color-text-muted)] text-lg mb-10 max-w-lg mx-auto">
          The coordinates you seek do not exist within this realm. Return to the known pathways.
        </p>
        <Link to="/">
          <Button size="lg" className="px-10 tracking-widest uppercase">
            Return to Base
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}