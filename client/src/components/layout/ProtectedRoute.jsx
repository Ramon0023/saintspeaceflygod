import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (adminOnly && user?.role !== 'admin') return <Navigate to="/profile" replace />;

  return <Outlet />;
}
