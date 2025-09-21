'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AdminService, UserWithTestStatus, UserTestResult } from '@/lib/services/adminService';
import { UserResultsTable } from '@/components/admin/UserResultsTable';
import { DetailedTestResults } from '@/components/admin/DetailedTestResults';

export const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAuth();
  const [users, setUsers] = useState<UserWithTestStatus[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserTestResult | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ totalUsers: number; totalTests: number; usersWithTests: number; completionRate: string | number } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Loading dashboard data...');
      
      // Load users and statistics in parallel
      const [usersResult, statsResult] = await Promise.all([
        AdminService.getAllUsers(),
        AdminService.getTestStatistics()
      ]);

      console.log('Users result:', usersResult);
      console.log('Stats result:', statsResult);

      if (usersResult.error) {
        console.error('Users error:', usersResult.error);
        setError(`Users error: ${usersResult.error}`);
        return;
      }

      if (statsResult.error) {
        console.error('Stats error:', statsResult.error);
        setError(`Statistics error: ${statsResult.error}`);
        return;
      }

      setUsers(usersResult.users);
      setStats(statsResult.stats);
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Dashboard load error:', error);
      setError(`Failed to load dashboard data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserResults = (userId: string) => {
    // Navigate to the user results page
    window.location.href = `/admin/user-results?userId=${userId}`;
  };

  const handleCloseResults = () => {
    setSelectedUser(null);
    setShowDetailedResults(false);
  };

  const handleShowDetailedResults = () => {
    setShowDetailedResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-700 font-medium">Welcome, {admin?.user_id}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="text-slate-200 border-slate-300 hover:bg-slate-100 hover:text-slate-900 font-medium"
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
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-700 font-medium">Loading dashboard data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button onClick={loadDashboardData} className="bg-red-600 hover:bg-red-700 text-white">Try Again</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-slate-600 truncate uppercase tracking-wide">
                            Total Tests
                          </dt>
                          <dd className="text-2xl font-bold text-slate-900">
                            {stats?.totalTests || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-slate-600 truncate uppercase tracking-wide">
                            Registered Users
                          </dt>
                          <dd className="text-2xl font-bold text-slate-900">
                            {stats?.totalUsers || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-slate-600 truncate uppercase tracking-wide">
                            Users with Tests
                          </dt>
                          <dd className="text-2xl font-bold text-slate-900">
                            {stats?.usersWithTests || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-slate-600 truncate uppercase tracking-wide">
                            Completion Rate
                          </dt>
                          <dd className="text-2xl font-bold text-slate-900">
                            {stats?.completionRate || 0}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white shadow-lg rounded-xl border border-slate-200">
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">
                      User Test Results
                    </h3>
                    <div className="text-sm text-slate-600 font-medium">
                      {users.length} {users.length === 1 ? 'user' : 'users'} total
                    </div>
                  </div>
                  
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
                      <p className="text-slate-600">
                        Users will appear here once they register and take tests.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Test Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Tests Taken
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Last Test
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {users.map((userWithStatus) => (
                            <tr key={userWithStatus.user.id} className="hover:bg-slate-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-slate-900">
                                  {userWithStatus.user.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-700">
                                  {userWithStatus.user.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  userWithStatus.hasTakenTest 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {userWithStatus.hasTakenTest ? 'Completed' : 'Not Taken'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                {userWithStatus.testCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                {userWithStatus.lastTestDate 
                                  ? new Date(userWithStatus.lastTestDate).toLocaleDateString()
                                  : 'Never'
                                }
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {userWithStatus.hasTakenTest ? (
                                  <Button
                                    onClick={() => handleViewUserResults(userWithStatus.user.id)}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                                  >
                                    View Results
                                  </Button>
                                ) : (
                                  <span className="text-slate-500 font-medium">No results</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* User Results Modal */}
      {selectedUser && !showDetailedResults && (
        <UserResultsTable 
          result={selectedUser} 
          onClose={handleCloseResults}
          onShowDetailed={handleShowDetailedResults}
        />
      )}

      {/* Detailed Results Modal */}
      {selectedUser && showDetailedResults && (
        <DetailedTestResults result={selectedUser} onClose={handleCloseResults} />
      )}
    </div>
  );
};
