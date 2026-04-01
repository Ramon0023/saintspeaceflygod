import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('If an account exists, a recovery link has been sent.');
      setEmail('');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 md:p-12 relative overflow-hidden"
      >
        <h1 className="font-serif italic text-4xl mb-2">Recover Access</h1>
        <p className="text-[var(--color-text-muted)] mb-8">Enter your email to receive a password reset link.</p>
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Button type="submit" className="w-full mt-4" isLoading={loading}>
            Send Recovery Link
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          Remembered your passage? <Link to="/login" className="text-white hover:text-[var(--color-highlight)] transition-colors">Return to Login.</Link>
        </p>
      </motion.div>
    </div>
  );
}
