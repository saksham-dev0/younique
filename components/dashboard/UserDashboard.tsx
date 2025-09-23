'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { TestService } from '@/lib/services/testService';
import { Button } from '@/components/ui/button';

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [hasTakenTest, setHasTakenTest] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTestStatus = async () => {
      if (!user) return;
      
      try {
        const { hasTaken, error } = await TestService.hasUserTakenTest(user.id);
        if (!error) {
          setHasTakenTest(hasTaken);
        }
      } catch (error) {
        console.error('Failed to check test status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTestStatus();
  }, [user]);

  const handleTakeTest = () => {
    window.location.href = '/test';
  };

  const handleRetakeTest = () => {
    // Pass a retake flag so the test page can reset previous responses
    window.location.href = '/test?retake=1';
  };

  const handleViewResults = () => {
    window.location.href = '/results';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Maturity Test</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="text-gray-200 hover:text-gray-900"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            </div>
          ) : hasTakenTest ? (
            // User has taken the test - show results option
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Test Completed!
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    You have successfully completed the Task Maturity Test. View your detailed results and analysis below.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Your Results Are Ready</h3>
                    <ul className="text-green-800 text-left space-y-2">
                      <li>• Detailed analysis of your task maturity dimensions</li>
                      <li>• Performance insights and recommendations</li>
                      <li>• Score breakdown across all 8 dimensions</li>
                      <li>• Range analysis with actionable feedback</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleViewResults}
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
                    >
                      View My Results
                    </Button>
                    <Button
                      onClick={handleRetakeTest}
                      size="lg"
                      variant="outline"
                      className="px-8 py-3 text-lg"
                    >
                      Retake Test
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // User hasn't taken the test - show test instructions
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Take the Test?
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    This test will help assess your task maturity level through 7 carefully designed questions. 
                    You&apos;ll distribute 10 points across 8 options for each question based on what best describes you.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Instructions</h3>
                    <ul className="text-blue-800 text-left space-y-2">
                      <li>• You&apos;ll answer 7 questions about your work style and preferences</li>
                      <li>• Each question has 8 options</li>
                      <li>• Distribute exactly 10 points across the options for each question</li>
                      <li>• You can give all 10 points to one option or spread them across multiple options</li>
                      <li>• The total must always equal 10 points per question</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleTakeTest}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
                  >
                    Take Test
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
