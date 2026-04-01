import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Particles from './components/layout/Particles';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CartDrawer from './components/cart/CartDrawer';
import NotFound from './pages/NotFound';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const { settings } = useSettingsStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (settings.maintenance_mode === 'true') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <Particles />
        <h1 className="brand-name text-6xl text-[var(--color-highlight)] mb-4">Saintspeaceflygod™</h1>
        <h2 className="font-serif italic text-2xl mb-8">The void is currently calibrating.</h2>
        <p className="text-[var(--color-text-muted)] max-w-md">Our digital manifestation is undergoing a planned ascension. We will return soon.</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-transparent text-[#F3EEFF]">
        <Particles />
        <Navbar />
        <main className={`flex-grow ${settings.announcement_banner ? 'pt-32' : 'pt-24'} relative z-10`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: 'rgba(14, 0, 26, 0.9)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            color: '#F3EEFF',
            backdropFilter: 'blur(10px)'
          }
        }} />
      </div>
    </Router>
  );
}

export default App;
