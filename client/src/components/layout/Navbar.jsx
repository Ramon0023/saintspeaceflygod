import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const toggleCart = useCartStore(state => state.toggleCart);
  const totalItems = useCartStore(state => state.getTotalItems());
  const { isAuthenticated, user } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {settings.announcement_banner && (
        <div className="bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-widest py-2 text-center fixed top-0 w-full z-[100] font-sans font-bold">
          {settings.announcement_banner}
        </div>
      )}
      <nav className={`fixed ${settings.announcement_banner ? 'top-[30px]' : 'top-0'} w-full z-40 transition-all duration-300 ${scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Invert is used to turn a black-on-transparent logo into white-on-transparent */}
          <img 
            src="/logo.png" 
            alt="Saintspeaceflygod Logo" 
            className="h-16 w-20 object-contain transition-transform group-hover:scale-105"
            style={{ filter: 'invert(1)' }}
          />
          <span className="brand-name text-xl md:text-3xl text-white">Saintspeaceflygod™</span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex space-x-10 text-sm tracking-wide font-sans text-[var(--color-text-primary)]">
          <Link to="/" className="hover:text-[var(--color-highlight)] transition-colors">Home</Link>
          <Link to="/collections" className="hover:text-[var(--color-highlight)] transition-colors">Collections</Link>
          <Link to="/about" className="hover:text-[var(--color-highlight)] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[var(--color-highlight)] transition-colors">Contact</Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-5">
          <button 
            className="text-[var(--color-text-primary)] hover:text-white transition-transform hover:scale-110"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} />
          </button>
          <Link
            to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/profile') : '/login'}
            className="text-[var(--color-text-primary)] hover:text-white transition-transform hover:scale-110"
          >
            <User size={20} />
          </Link>
          <button 
            className="text-[var(--color-text-primary)] hover:text-white transition-transform hover:scale-110 relative"
            onClick={toggleCart}
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1.5 -right-2 bg-[var(--color-accent)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </button>
          <button className="md:hidden text-white ml-2" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center space-y-8 text-2xl font-sans">
          <button className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <X size={36} />
          </button>
          <button className="hover:text-[var(--color-highlight)]" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}>Search</button>
          <Link to="/" className="hover:text-[var(--color-highlight)]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/collections" className="hover:text-[var(--color-highlight)]" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
          <Link to="/about" className="hover:text-[var(--color-highlight)]" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="hover:text-[var(--color-highlight)]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
      )}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
    </>
  );
}
