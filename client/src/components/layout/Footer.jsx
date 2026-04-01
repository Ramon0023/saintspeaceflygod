import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/subscribers', { email });
      toast.success(res.data.message);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-[rgba(147,51,234,0.15)] bg-[rgba(14,0,26,0.5)] backdrop-blur-md pt-16 pb-8 mt-20 relative z-10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 border-b border-[rgba(255,255,255,0.05)] md:border-b-0 pb-8 md:pb-0">
            <h3 className="brand-name text-2xl text-white mb-2">Saintspeaceflygod™</h3>
            <p className="motto text-[var(--color-text-muted)] mb-6">dream to inspire</p>
            <div className="cultural-stamp text-xs text-white/40 tracking-widest mt-8">
              BRAND4THECHLDRN
            </div>
          </div>

          {/* Links: Shop */}
          <div className="hidden md:block">
            <h4 className="text-sm font-sans font-semibold text-white mb-6 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)] flex flex-col items-start gap-1">
              <li><Link to="/collections" className="hover:text-[var(--color-highlight)] transition-colors">All Collections</Link></li>
              <li><Link to="/collections?collection=Fallen+Angels" className="hover:text-[var(--color-highlight)] transition-colors">Fallen Angels</Link></li>
              <li><Link to="/collections?collection=Elevated" className="hover:text-[var(--color-highlight)] transition-colors">Elevated</Link></li>
              <li><Link to="/collections?collection=Dreamstate" className="hover:text-[var(--color-highlight)] transition-colors">Dreamstate</Link></li>
              <li><Link to="/collections?collection=The+Chosen" className="hover:text-[var(--color-highlight)] transition-colors">The Chosen</Link></li>
            </ul>
          </div>

          {/* Links: Info */}
          <div className="hidden md:block">
            <h4 className="text-sm font-sans font-semibold text-white mb-6 uppercase tracking-wider">Info</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)] flex flex-col items-start gap-1">
              <li><Link to="/about" className="hover:text-[var(--color-highlight)] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-highlight)] transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--color-highlight)] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[var(--color-highlight)] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-sans font-semibold text-white mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">Subscribe for early access to drops.</p>
            <form className="flex border-b border-[rgba(147,51,234,0.3)] pb-2" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="bg-transparent w-full text-sm text-white focus:outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="text-[var(--color-accent)] hover:text-[var(--color-highlight)] text-sm uppercase tracking-wide font-semibold ml-4 disabled:opacity-50" disabled={loading}>
                {loading ? '...' : 'Join'}
              </button>
            </form>
            <div className="flex gap-4 mt-8">
              <a href="#" onClick={(e) => { e.preventDefault(); toast('Forwarding to Instagram...'); }} className="w-8 h-8 rounded-full border border-[var(--color-text-muted)] flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)] transition-colors">
                IG
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast('Forwarding to X...'); }} className="w-8 h-8 rounded-full border border-[var(--color-text-muted)] flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)] transition-colors">
                X
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast('Forwarding to TikTok...'); }} className="w-8 h-8 rounded-full border border-[var(--color-text-muted)] flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)] transition-colors">
                TT
              </a>
            </div>
          </div>

        </div>

        <div className="mt-16 text-center text-xs text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Saintspeaceflygod™. All rights reserved.
        </div>
      </div>
    </footer>
  );
}