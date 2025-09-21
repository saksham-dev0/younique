'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { AuthPage } from '@/components/auth/AuthPage';

export default function Home() {
  const { user, admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is logged in, show user dashboard
  if (user) {
    return (
      <ProtectedRoute requireUser>
        <UserDashboard />
      </ProtectedRoute>
    );
  }

  // If admin is logged in, show admin dashboard
  if (admin) {
    return (
      <ProtectedRoute requireAdmin>
        <AdminDashboard />
      </ProtectedRoute>
    );
  }

  // If no one is logged in, show auth page
  return <AuthPage />;
}
