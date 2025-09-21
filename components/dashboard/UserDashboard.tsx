'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleTakeTest = () => {
    window.location.href = '/test';
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
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Take the Test?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  This test will help assess your task maturity level through 7 carefully designed questions. 
                  You'll distribute 10 points across 8 options for each question based on what best describes you.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Instructions</h3>
                  <ul className="text-blue-800 text-left space-y-2">
                    <li>• You'll answer 7 questions about your work style and preferences</li>
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
        </div>
      </main>
    </div>
  );
};
