'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface TestCompleteProps {
  onBackToDashboard: () => void;
}

export const TestComplete: React.FC<TestCompleteProps> = ({ onBackToDashboard }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Test Completed!
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you, {user?.name}! Your task maturity assessment has been successfully submitted.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What&apos;s Next?</h3>
            <ul className="text-blue-800 text-left space-y-2">
              <li>• Your responses have been recorded and analyzed</li>
              <li>• The admin can now view your test results</li>
              <li>• You can take the test again anytime if needed</li>
              <li>• Your progress is saved in your account</li>
            </ul>
          </div>

          <Button
            onClick={onBackToDashboard}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
