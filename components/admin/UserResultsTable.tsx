'use client';

import React from 'react';
import { UserTestResult } from '@/lib/services/adminService';

interface UserResultsTableProps {
  result: UserTestResult;
  onClose?: () => void;
  onShowDetailed?: () => void;
}

export const UserResultsTable: React.FC<UserResultsTableProps> = ({ result, onClose, onShowDetailed }) => {
  // Create the option mapping as shown in the image
  // Each question has options A-H mapped to positions 1-8 in a specific order
  const optionMapping = [
    ['G', 'D', 'F', 'C', 'A', 'H', 'B', 'E'], // Question I - Fixed
    ['A', 'B', 'E', 'G', 'C', 'D', 'F', 'H'], // Question II
    ['H', 'A', 'C', 'D', 'F', 'G', 'E', 'B'], // Question III
    ['D', 'H', 'B', 'E', 'G', 'C', 'A', 'F'], // Question IV
    ['B', 'F', 'D', 'H', 'E', 'A', 'C', 'G'], // Question V
    ['F', 'C', 'G', 'A', 'H', 'E', 'B', 'D'], // Question VI
    ['E', 'G', 'A', 'F', 'D', 'B', 'H', 'C']  // Question VII
  ];

  // Create a map of option text to option ID for quick lookup
  const optionTextToId = new Map<string, string>();
  result.questions.forEach(question => {
    question.options.forEach(option => {
      optionTextToId.set(option.option_text, option.id);
    });
  });

  // Create a map of option ID to points for quick lookup
  const optionIdToPoints = new Map<string, number>();
  result.responses.forEach(response => {
    optionIdToPoints.set(response.option_id, response.points);
  });

  // Get points for a specific question and position
  const getPointsForPosition = (questionIndex: number, position: number): number => {
    const optionLetter = optionMapping[questionIndex][position];
    
    // Find the option ID that corresponds to this letter for this question
    const question = result.questions[questionIndex];
    if (!question) return 0;

    // Find the option that corresponds to this letter
    // The optionLetter represents which option (A-H) should be in this position
    const optionIndex = optionLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
    const option = question.options[optionIndex];
    
    if (!option) return 0;
    
    return optionIdToPoints.get(option.id) || 0;
  };

  // Calculate column totals
  const getColumnTotal = (columnIndex: number): number => {
    let total = 0;
    for (let questionIndex = 0; questionIndex < 7; questionIndex++) {
      total += getPointsForPosition(questionIndex, columnIndex);
    }
    return total;
  };

  // Roman numerals for questions
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header - only show if onClose is provided (modal mode) */}
      {onClose && (
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Test Results: {result.user.name}
            </h2>
            <p className="text-slate-700 font-medium">
              Email: {result.user.email} | Completed: {result.session.completed_at ? new Date(result.session.completed_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors duration-150"
          >
            ×
          </button>
        </div>
      )}

        {/* Results Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-sm shadow-sm">
              {/* Header Row */}
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                  <th className="border border-slate-300 px-4 py-3 font-bold text-center text-slate-800 uppercase tracking-wide">
                    SECTION
                  </th>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <th key={num} className="border border-slate-300 px-4 py-3 font-bold text-center text-slate-800">
                      {num}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody>
                {result.questions.map((question, questionIndex) => (
                  <tr key={question.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="border border-slate-300 px-4 py-3 font-bold text-center bg-slate-100 text-slate-800">
                      {romanNumerals[questionIndex]}
                    </td>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(position => (
                      <td key={position} className="border border-slate-300 px-4 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-slate-600 mb-1 font-medium">
                            {optionMapping[questionIndex][position]}
                          </div>
                          <div className="font-bold text-slate-900 text-lg">
                            {getPointsForPosition(questionIndex, position)}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-gradient-to-r from-slate-200 to-slate-100 font-bold">
                  <td className="border border-slate-300 px-4 py-3 text-center text-slate-900 uppercase tracking-wide">
                    TOTAL
                  </td>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map(position => (
                    <td key={position} className="border border-slate-300 px-4 py-3 text-center text-slate-900 text-lg">
                      {getColumnTotal(position)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-900">Test Summary</h3>
              </div>
              <p className="text-blue-800 font-semibold text-lg">
                Total Points: {result.responses.reduce((sum, response) => sum + response.points, 0)}/70
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-emerald-900">Completion</h3>
              </div>
              <p className="text-emerald-800 font-semibold text-lg">
                Questions Answered: {result.questions.length}/7
              </p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-6 rounded-xl border border-violet-200 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-violet-900">Date</h3>
              </div>
              <p className="text-violet-800 font-semibold text-lg">
                {result.session.completed_at ? new Date(result.session.completed_at).toLocaleString() : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            {onShowDetailed && (
              <button
                onClick={onShowDetailed}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Detailed Analysis
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Close
              </button>
            )}
          </div>
        </div>
    </div>
  );
};
