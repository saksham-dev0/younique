'use client';

import React, { useState } from 'react';
import { DatabaseSetup } from '@/lib/database/setup';
import { Button } from '@/components/ui/button';

export default function SetupPage() {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runSetup = async () => {
    setIsLoading(true);
    setStatus('Running database setup...');

    try {
      // Test connection first
      const connectionTest = await DatabaseSetup.testConnection();
      if (!connectionTest.success) {
        setStatus(`❌ Connection failed: ${connectionTest.error}`);
        setIsLoading(false);
        return;
      }

      setStatus('✅ Database connection successful');

      // Check and setup admin
      const adminSetup = await DatabaseSetup.checkAdminSetup();
      if (!adminSetup.success) {
        setStatus(`❌ Admin setup failed: ${adminSetup.error}`);
        setIsLoading(false);
        return;
      }

      setStatus('✅ Database setup complete! Admin credentials: admin / admin123\n\n⚠️ IMPORTANT: You still need to run the test data SQL in your Supabase SQL Editor:\n1. Go to Supabase Dashboard → SQL Editor\n2. Copy and paste the SQL from: lib/database/populate-test-data.sql\n3. Run the SQL to insert test questions and options');
    } catch (error) {
      setStatus(`❌ Setup error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Database Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Run this to set up your database tables and admin user
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={runSetup}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isLoading ? 'Setting up...' : 'Run Database Setup'}
          </Button>

          {status && (
            <div className={`rounded-md p-4 ${status.includes('❌') ? 'bg-red-50' : status.includes('✅') ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`text-sm whitespace-pre-line ${status.includes('❌') ? 'text-red-700' : status.includes('✅') ? 'text-green-700' : 'text-gray-700'}`}>
                {status}
              </div>
              {status.includes('RLS Error') && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="font-semibold text-yellow-800 mb-2">Quick Fix:</h4>
                  <ol className="text-sm text-yellow-700 space-y-1">
                    <li>1. Go to your Supabase dashboard</li>
                    <li>2. Navigate to SQL Editor</li>
                    <li>3. Copy and paste the SQL from: <code className="bg-yellow-100 px-1 rounded">lib/database/fix-rls.sql</code></li>
                    <li>4. Run the SQL</li>
                    <li>5. Refresh this page and try again</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <a
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
