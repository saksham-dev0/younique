'use client';

import React, { useState } from 'react';
import { UserLogin } from './UserLogin';
import { UserSignup } from './UserSignup';
import { AdminLogin } from './AdminLogin';

type AuthMode = 'login' | 'signup' | 'admin';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const switchToLogin = () => setMode('login');
  const switchToSignup = () => setMode('signup');
  const switchToAdmin = () => setMode('admin');
  const switchToUser = () => setMode('login');

  return (
    <div>
      {mode === 'login' && (
        <UserLogin 
          onSwitchToSignup={switchToSignup}
          onSwitchToAdmin={switchToAdmin}
        />
      )}
      {mode === 'signup' && (
        <UserSignup 
          onSwitchToLogin={switchToLogin}
          onSwitchToAdmin={switchToAdmin}
        />
      )}
      {mode === 'admin' && (
        <AdminLogin 
          onSwitchToUser={switchToUser}
        />
      )}
    </div>
  );
};
