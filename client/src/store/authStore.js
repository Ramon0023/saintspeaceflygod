import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // initial load checks auth

  checkAuth: async () => {
    try {
      const res = await axios.get('/api/auth/me');
      set({ user: res.data, isAuthenticated: true });
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      set({ user: res.data, isAuthenticated: true });
      toast.success('Access granted.');
      return res.data; // return full user so caller can check role
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return null;
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      set({ user: res.data, isAuthenticated: true });
      toast.success('Welcome to the void.');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return null;
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out.');
    } catch (err) {
      console.error(err);
    }
  }
}));
