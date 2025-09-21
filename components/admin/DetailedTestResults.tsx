'use client';

import React, { useState, useEffect } from 'react';
import { UserTestResult } from '@/lib/services/adminService';
import { RangeAnalysisService } from '@/lib/services/rangeAnalysisService';
import { DetailedTestResult, DimensionResult } from '@/lib/types/range';

interface DetailedTestResultsProps {
  result: UserTestResult;
  onClose: () => void;
}

export const DetailedTestResults: React.FC<DetailedTestResultsProps> = ({ result, onClose }) => {
  const [detailedResult, setDetailedResult] = useState<DetailedTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyzeResults();
  }, [result]);

  const analyzeResults = async () => {
    try {
      console.log('Starting analysis for user:', result.user.id);
      setLoading(true);
      setError(null);

      const { result: analyzedResult, error } = await RangeAnalysisService.analyzeTestResults(result.user.id);
      
      console.log('Analysis result:', { analyzedResult, error });
      
      if (error) {
        console.error('Analysis error:', error);
        setError(error);
        return;
      }

      console.log('Setting detailed result:', analyzedResult);
      setDetailedResult(analyzedResult);
    } catch (error) {
      console.error('Analysis exception:', error);
      setError('Failed to analyze test results');
    } finally {
      setLoading(false);
    }
  };

  const getRangeColor = (range: string) => {
    switch (range) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Average':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 font-semibold text-lg">Analyzing test results...</p>
          <p className="text-slate-600 mt-2">Please wait while we process your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-bold text-lg">Analysis Error</p>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!detailedResult) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-700 font-semibold text-lg">No detailed analysis available</p>
          <p className="text-slate-600 mt-2">Loading: {loading ? 'Yes' : 'No'} | Error: {error || 'None'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Detailed Test Analysis: {detailedResult.user?.name || 'Unknown User'}
          </h2>
          <p className="text-slate-700 font-medium">
            Email: {detailedResult.user?.email || 'Unknown'} | Completed: {detailedResult.session?.completed_at ? new Date(detailedResult.session.completed_at).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
      </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-900 text-lg">Total Score</h3>
              </div>
              <p className="text-4xl font-bold text-blue-800 mb-2">{result.responses.reduce((sum, response) => sum + response.points, 0)}/70</p>
              <p className="text-blue-700 font-medium">Maximum possible score</p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-emerald-900 text-lg">High Performance</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-800 mb-2">
                {detailedResult.dimensionResults.filter(d => d.range === 'High').length}
              </p>
              <p className="text-emerald-700 font-medium">Dimensions</p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-6 rounded-xl border border-violet-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-violet-900 text-lg">Completion Rate</h3>
              </div>
              <p className="text-4xl font-bold text-violet-800 mb-2">100%</p>
              <p className="text-violet-700 font-medium">All questions answered</p>
            </div>
          </div>

          {/* Dimension Results */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Dimension Analysis</h3>
            
            {detailedResult.dimensionResults.map((dimension, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      {index + 1}. {dimension.dimensionName}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="font-semibold text-slate-700">Score:</span>
                        <span className="ml-2 font-bold text-slate-900">{dimension.score}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-slate-700">Range:</span>
                        <span className="ml-2 font-bold text-slate-900">{dimension.rangeValue}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-slate-700">Column:</span>
                        <span className="ml-2 font-bold text-slate-900">{dimension.column}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRangeColor(dimension.range)}`}>
                    {dimension.range}
                  </div>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 mb-3 text-lg">Range Response:</h5>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {dimension.range === 'High' && "You demonstrate excellent performance in this dimension. Your high scores indicate strong capabilities and effective task management skills."}
                    {dimension.range === 'Average' && "You show moderate performance in this dimension. There's room for improvement to reach higher levels of effectiveness."}
                    {dimension.range === 'Low' && "This dimension requires attention and development. Consider focusing on building skills in this area to improve overall task maturity."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Range Legend */}
          <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Range Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded-lg"></div>
                <div>
                  <p className="font-bold text-slate-900">Low (Columns 1-2)</p>
                  <p className="text-sm text-slate-700 font-medium">Scores that fall in the low range values</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-300 rounded-lg"></div>
                <div>
                  <p className="font-bold text-slate-900">Average (Columns 3-5)</p>
                  <p className="text-sm text-slate-700 font-medium">Scores that fall in the average range values</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded-lg"></div>
                <div>
                  <p className="font-bold text-slate-900">High (Columns 6-7)</p>
                  <p className="text-sm text-slate-700 font-medium">Scores that fall in the high range values</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3 text-lg">How it works:</h4>
              <p className="text-slate-800 font-medium leading-relaxed">
                Each dimension has specific score ranges: 
                <br />• <strong>Low (Columns 1-2):</strong> Scores &gt;=7 and 8-9
                <br />• <strong>Average (Columns 3-5):</strong> Scores 10 to 13  
                <br />• <strong>High (Columns 6-7):</strong> Scores 14 to &lt;=17
                <br />Your score is matched against these ranges to determine the performance level.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};
