import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newUser = await register(name, email, password);
    setLoading(false);
    if (newUser) navigate('/profile');
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-highlight)] rounded-full blur-[80px] opacity-20"></div>
        
        <h1 className="font-serif italic text-4xl mb-2">Join the Order</h1>
        <p className="text-[var(--color-text-muted)] mb-8">Create your profile to access exclusives.</p>
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Full Name" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button type="submit" className="w-full mt-6" isLoading={loading}>
            Establish Link
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          Already one of us? <Link to="/login" className="text-white hover:text-[var(--color-highlight)] transition-colors">Login here.</Link>
        </p>
      </motion.div>
    </div>
  );
}
