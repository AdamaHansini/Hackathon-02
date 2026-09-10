import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, navigate }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Checking credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('login');
    return null;
  }

  if (adminOnly && !isAdmin) {
    navigate('dashboard');
    return null;
  }

  return <>{children}</>;
}
