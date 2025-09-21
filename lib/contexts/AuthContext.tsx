'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin, AuthState, LoginCredentials, AdminLoginCredentials, SignupData } from '@/lib/types/auth';
import { UserAuth } from '@/lib/auth/userAuth';
import { AdminAuth } from '@/lib/auth/adminAuth';

interface AuthContextType extends AuthState {
  userLogin: (credentials: LoginCredentials) => Promise<boolean>;
  userSignup: (data: SignupData) => Promise<boolean>;
  adminLogin: (credentials: AdminLoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing sessions on mount
    const checkAuth = async () => {
      try {
        const currentUser = await UserAuth.getCurrentUser();
        const currentAdmin = await AdminAuth.getCurrentAdmin();
        
        if (currentUser) {
          setUser(currentUser);
        } else if (currentAdmin) {
          setAdmin(currentAdmin);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const userLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const { user: loggedInUser, error: loginError } = await UserAuth.login(credentials);
    
    if (loginError) {
      setError(loginError);
      setLoading(false);
      return false;
    }

    if (loggedInUser) {
      setUser(loggedInUser);
      setAdmin(null); // Clear admin session
      UserAuth.setUserSession(loggedInUser);
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const userSignup = async (data: SignupData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const { user: newUser, error: signupError } = await UserAuth.signup(data);
    
    if (signupError) {
      setError(signupError);
      setLoading(false);
      return false;
    }

    if (newUser) {
      setUser(newUser);
      setAdmin(null); // Clear admin session
      UserAuth.setUserSession(newUser);
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const adminLogin = async (credentials: AdminLoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const { admin: loggedInAdmin, error: loginError } = await AdminAuth.login(credentials);
    
    if (loginError) {
      setError(loginError);
      setLoading(false);
      return false;
    }

    if (loggedInAdmin) {
      setAdmin(loggedInAdmin);
      setUser(null); // Clear user session
      AdminAuth.setAdminSession(loggedInAdmin);
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setError(null);
    UserAuth.logout();
    AdminAuth.logout();
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    admin,
    loading,
    error,
    userLogin,
    userSignup,
    adminLogin,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
