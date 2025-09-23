'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { TestService } from '@/lib/services/testService';
import { TestInterface } from '@/components/test/TestInterface';
import { TestComplete } from '@/components/test/TestComplete';
import { UserDetailedResults } from '@/components/test/UserDetailedResults';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

type TestState = 'loading' | 'checking' | 'test' | 'complete' | 'results' | 'error';

export default function TestPage() {
  const { user } = useAuth();
  const [testState, setTestState] = useState<TestState>('loading');
  const [error, setError] = useState<string | null>(null);

  const checkTestStatus = useCallback(async () => {
    if (!user) return;

    setTestState('checking');
    try {
      const { hasTaken, error } = await TestService.hasUserTakenTest(user.id);
      
      if (error) {
        setError(error);
        setTestState('error');
        return;
      }

      if (hasTaken) {
        // User has already taken the test, show detailed results
        setTestState('results');
      } else {
        // User can take the test
        setTestState('test');
      }
    } catch {
      setError('Failed to check test status');
      setTestState('error');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkTestStatus();
    }
  }, [user, checkTestStatus]);

  const handleTestComplete = () => {
    setTestState('results');
  };

  const handleBackToDashboard = () => {
    window.location.href = '/';
  };

  if (testState === 'loading' || testState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {testState === 'loading' ? 'Loading...' : 'Checking test status...'}
          </p>
        </div>
      </div>
    );
  }

  if (testState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={checkTestStatus}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireUser>
      {testState === 'test' && (
        <TestInterface onTestComplete={handleTestComplete} />
      )}
      {testState === 'complete' && (
        <TestComplete onBackToDashboard={handleBackToDashboard} />
      )}
      {testState === 'results' && (
        <UserDetailedResults onBackToDashboard={handleBackToDashboard} />
      )}
    </ProtectedRoute>
  );
}
