'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { TestService } from '@/lib/services/testService';
import { UserDetailedResults } from '@/components/test/UserDetailedResults';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

type ResultsState = 'loading' | 'checking' | 'results' | 'error' | 'not-taken';

export default function ResultsPage() {
  const { user } = useAuth();
  const [resultsState, setResultsState] = useState<ResultsState>('loading');
  const [error, setError] = useState<string | null>(null);

  const checkTestStatus = useCallback(async () => {
    if (!user) return;

    setResultsState('checking');
    try {
      const { hasTaken, error } = await TestService.hasUserTakenTest(user.id);
      
      if (error) {
        setError(error);
        setResultsState('error');
        return;
      }

      if (hasTaken) {
        // User has taken the test, show results
        setResultsState('results');
      } else {
        // User hasn't taken the test yet
        setResultsState('not-taken');
      }
    } catch {
      setError('Failed to check test status');
      setResultsState('error');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkTestStatus();
    }
  }, [user, checkTestStatus]);

  const handleBackToDashboard = () => {
    window.location.href = '/';
  };

  const handleTakeTest = () => {
    window.location.href = '/test';
  };

  if (resultsState === 'loading' || resultsState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {resultsState === 'loading' ? 'Loading...' : 'Checking test status...'}
          </p>
        </div>
      </div>
    );
  }

  if (resultsState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={checkTestStatus}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md mr-4"
          >
            Try Again
          </button>
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (resultsState === 'not-taken') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {/* Info Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              No Test Results Found
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              You haven't taken the Task Maturity Test yet. Take the test first to see your detailed results and analysis.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">What You'll Get</h3>
              <ul className="text-blue-800 text-left space-y-2">
                <li>• Detailed analysis of your task maturity dimensions</li>
                <li>• Performance insights and recommendations</li>
                <li>• Score breakdown across all 8 dimensions</li>
                <li>• Range analysis with actionable feedback</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleTakeTest}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 text-lg rounded-md"
              >
                Take Test Now
              </button>
              <button
                onClick={handleBackToDashboard}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 text-lg rounded-md"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireUser>
      {resultsState === 'results' && (
        <UserDetailedResults onBackToDashboard={handleBackToDashboard} />
      )}
    </ProtectedRoute>
  );
}
