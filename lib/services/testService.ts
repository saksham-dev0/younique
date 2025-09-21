import { supabase } from '@/lib/supabase/client';
import { QuestionWithOptions, TestSession, TestResponse } from '@/lib/types/test';

export class TestService {
  // Fetch all test questions with their options
  static async getTestQuestions(): Promise<{ questions: QuestionWithOptions[]; error: string | null }> {
    try {
      // First get all questions
      const { data: questions, error: questionsError } = await supabase
        .from('test_questions')
        .select('*')
        .order('question_order', { ascending: true });

      if (questionsError) {
        return { questions: [], error: questionsError.message };
      }

      if (!questions || questions.length === 0) {
        return { questions: [], error: 'No test questions found' };
      }

      // Get all options for these questions
      const questionIds = questions.map(q => q.id);
      const { data: options, error: optionsError } = await supabase
        .from('test_options')
        .select('*')
        .in('question_id', questionIds)
        .order('option_order', { ascending: true });

      if (optionsError) {
        return { questions: [], error: optionsError.message };
      }

      // Combine questions with their options
      const questionsWithOptions: QuestionWithOptions[] = questions.map(question => ({
        ...question,
        options: options?.filter(option => option.question_id === question.id) || []
      }));

      return { questions: questionsWithOptions, error: null };
    } catch {
      return { questions: [], error: 'Failed to fetch test questions' };
    }
  }

  // Submit test responses
  static async submitTestResponses(
    userId: string, 
    responses: TestResponse[]
  ): Promise<{ success: boolean; error: string | null; sessionId?: string }> {
    try {
      // Create a test session first
      const { data: session, error: sessionError } = await supabase
        .from('user_test_sessions')
        .insert([{
          user_id: userId,
          completed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (sessionError) {
        return { success: false, error: sessionError.message };
      }

      // Prepare responses for insertion
      const responseData = responses.map(response => ({
        user_id: userId,
        question_id: response.questionId,
        option_id: response.optionId,
        points: response.points
      }));

      // Insert all responses
      const { error: responsesError } = await supabase
        .from('user_test_responses')
        .insert(responseData);

      if (responsesError) {
        return { success: false, error: responsesError.message };
      }

      return { success: true, error: null, sessionId: session.id };
    } catch {
      return { success: false, error: 'Failed to submit test responses' };
    }
  }

  // Get user's test history
  static async getUserTestHistory(userId: string): Promise<{ sessions: TestSession[]; error: string | null }> {
    try {
      const { data: sessions, error } = await supabase
        .from('user_test_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        return { sessions: [], error: error.message };
      }

      return { sessions: sessions || [], error: null };
    } catch {
      return { sessions: [], error: 'Failed to fetch test history' };
    }
  }

  // Check if user has already taken the test
  static async hasUserTakenTest(userId: string): Promise<{ hasTaken: boolean; error: string | null }> {
    try {
      const { data: sessions, error } = await supabase
        .from('user_test_sessions')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (error) {
        return { hasTaken: false, error: error.message };
      }

      return { hasTaken: (sessions && sessions.length > 0) || false, error: null };
    } catch {
      return { hasTaken: false, error: 'Failed to check test status' };
    }
  }
}
