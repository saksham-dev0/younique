'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { TestService } from '@/lib/services/testService';
import { QuestionWithOptions, TestResponse } from '@/lib/types/test';
import { Button } from '@/components/ui/button';

interface TestInterfaceProps {
  onTestComplete: () => void;
}

export const TestInterface: React.FC<TestInterfaceProps> = ({ onTestComplete }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [questionId: string]: { [optionId: string]: number } }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTestQuestions();
  }, []);

  const loadTestQuestions = async () => {
    try {
      const { questions: testQuestions, error } = await TestService.getTestQuestions();
      if (error) {
        setError(error);
        return;
      }
      setQuestions(testQuestions);
      
      // Initialize responses with zeros
      const initialResponses: { [questionId: string]: { [optionId: string]: number } } = {};
      testQuestions.forEach(question => {
        initialResponses[question.id] = {};
        question.options.forEach(option => {
          initialResponses[question.id][option.id] = 0;
        });
      });
      setResponses(initialResponses);
    } catch (error) {
      setError('Failed to load test questions');
    } finally {
      setLoading(false);
    }
  };

  const handlePointChange = (questionId: string, optionId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [optionId]: numValue
      }
    }));
  };

  const getQuestionTotal = (questionId: string): number => {
    const questionResponses = responses[questionId] || {};
    return Object.values(questionResponses).reduce((sum, points) => sum + points, 0);
  };

  const isQuestionValid = (questionId: string): boolean => {
    return getQuestionTotal(questionId) === 10;
  };

  const canProceed = (): boolean => {
    return questions.every(question => isQuestionValid(question.id));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !canProceed()) return;

    setSubmitting(true);
    setError(null);

    try {
      // Convert responses to the format expected by the service
      const testResponses: TestResponse[] = [];
      Object.entries(responses).forEach(([questionId, questionResponses]) => {
        Object.entries(questionResponses).forEach(([optionId, points]) => {
          if (points > 0) {
            testResponses.push({
              questionId,
              optionId,
              points
            });
          }
        });
      });

      const { success, error } = await TestService.submitTestResponses(user.id, testResponses);
      
      if (success) {
        onTestComplete();
      } else {
        setError(error || 'Failed to submit test');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Test</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadTestQuestions}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Test Questions Found</h1>
          <p className="text-gray-600">Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionTotal = getQuestionTotal(currentQuestion.id);
  const isValid = isQuestionValid(currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Maturity Test</h1>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-semibold">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.question_text}
              </h2>
              
              {/* Points Total Display */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isValid ? 'bg-green-100 text-green-800' : 
                questionTotal > 10 ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                Points: {questionTotal}/10
                {!isValid && (
                  <span className="ml-2">
                    {questionTotal > 10 ? 'Too many points!' : 'Need exactly 10 points'}
                  </span>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900">{option.option_text}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`option-${option.id}`} className="text-sm font-medium text-gray-700">
                      Points:
                    </label>
                    <input
                      id={`option-${option.id}`}
                      type="number"
                      min="0"
                      max="10"
                      value={responses[currentQuestion.id]?.[option.id] || 0}
                      onChange={(e) => handlePointChange(currentQuestion.id, option.id, e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>

              <div className="flex space-x-4">
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {submitting ? 'Submitting...' : 'Submit Test'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isValid}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
