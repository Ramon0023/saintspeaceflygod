import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  // If already logged in, send them to the right place immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/profile', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loggedInUser = await login(email, password);
    setLoading(false);
    if (loggedInUser) navigate(loggedInUser.role === 'admin' ? '/admin' : '/profile');
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-[80px] opacity-30"></div>
        
        <h1 className="font-serif italic text-4xl mb-2">Access Portal</h1>
        <p className="text-[var(--color-text-muted)] mb-8">Enter your credentials to ascend.</p>
        
        <form onSubmit={handleSubmit}>
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
          
          <div className="text-right mb-8">
            <Link to="/forgot-password" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">
              Forgot passage?
            </Link>
          </div>
          
          <Button type="submit" className="w-full" isLoading={loading}>
            Authenticate
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          New to the movement? <Link to="/register" className="text-white hover:text-[var(--color-highlight)] transition-colors">Create an account.</Link>
        </p>
      </motion.div>
    </div>
  );
}
