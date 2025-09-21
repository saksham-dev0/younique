'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AuthPage } from './AuthPage';

interface ProtectedRouteProps {
  children: ReactNode;
  requireUser?: boolean;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireUser = false, 
  requireAdmin = false 
}) => {
  const { user, admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check if user is required but not logged in
  if (requireUser && !user) {
    return <AuthPage />;
  }

  // Check if admin is required but not logged in
  if (requireAdmin && !admin) {
    return <AuthPage />;
  }

  // If user is logged in but admin access is required
  if (user && requireAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  // If admin is logged in but user access is required
  if (admin && requireUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to regular users.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
