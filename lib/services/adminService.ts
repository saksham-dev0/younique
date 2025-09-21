import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/types/auth';
import { UserTestResponse, TestSession, QuestionWithOptions } from '@/lib/types/test';

export interface UserTestResult {
  user: User;
  session: TestSession;
  responses: UserTestResponse[];
  questions: QuestionWithOptions[];
}

export interface UserWithTestStatus {
  user: User;
  hasTakenTest: boolean;
  testCount: number;
  lastTestDate?: string;
}

export class AdminService {
  // Get all users with their test status
  static async getAllUsers(): Promise<{ users: UserWithTestStatus[]; error: string | null }> {
    try {
      // Get all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        return { users: [], error: usersError.message };
      }

      if (!users || users.length === 0) {
        return { users: [], error: null };
      }

      // Get test session counts for each user
      const userIds = users.map(user => user.id);
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_test_sessions')
        .select('user_id, completed_at')
        .in('user_id', userIds)
        .order('completed_at', { ascending: false });

      if (sessionsError) {
        console.error('Sessions error:', sessionsError);
        return { users: [], error: sessionsError.message };
      }

      // Combine user data with test status
      const usersWithStatus: UserWithTestStatus[] = users.map(user => {
        const userSessions = sessions?.filter(session => session.user_id === user.id) || [];
        return {
          user,
          hasTakenTest: userSessions.length > 0,
          testCount: userSessions.length,
          lastTestDate: userSessions.length > 0 && userSessions[0].completed_at 
            ? userSessions[0].completed_at 
            : undefined
        };
      });

      return { users: usersWithStatus, error: null };
    } catch {
      return { users: [], error: 'Failed to fetch users' };
    }
  }

  // Get detailed test result for a specific user
  static async getUserTestResult(userId: string): Promise<{ result: UserTestResult | null; error: string | null }> {
    try {
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        return { result: null, error: userError.message };
      }

      // Get user's latest test session
      const { data: session, error: sessionError } = await supabase
        .from('user_test_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError) {
        return { result: null, error: 'User has not taken the test' };
      }

      // Get user's test responses
      const { data: responses, error: responsesError } = await supabase
        .from('user_test_responses')
        .select('*')
        .eq('user_id', userId);

      if (responsesError) {
        return { result: null, error: responsesError.message };
      }

      // Get test questions and options
      const { data: questions, error: questionsError } = await supabase
        .from('test_questions')
        .select('*')
        .order('question_order', { ascending: true });

      if (questionsError) {
        return { result: null, error: questionsError.message };
      }

      // Get all options for these questions
      const questionIds = questions.map(q => q.id);
      const { data: options, error: optionsError } = await supabase
        .from('test_options')
        .select('*')
        .in('question_id', questionIds)
        .order('option_order', { ascending: true });

      if (optionsError) {
        return { result: null, error: optionsError.message };
      }

      // Combine questions with their options
      const questionsWithOptions: QuestionWithOptions[] = questions.map(question => ({
        ...question,
        options: options?.filter(option => option.question_id === question.id) || []
      }));

      return {
        result: {
          user,
          session,
          responses: responses || [],
          questions: questionsWithOptions
        },
        error: null
      };
    } catch {
      return { result: null, error: 'Failed to fetch user test result' };
    }
  }

  // Get test statistics
  static async getTestStatistics(): Promise<{ stats: { totalUsers: number; totalTests: number; usersWithTests: number; completionRate: string | number } | null; error: string | null }> {
    try {
      // Get total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        return { stats: null, error: usersError.message };
      }

      // Get total test sessions
      const { count: totalTests, error: testsError } = await supabase
        .from('user_test_sessions')
        .select('*', { count: 'exact', head: true });

      if (testsError) {
        return { stats: null, error: testsError.message };
      }

      // Get users who have taken tests
      const { count: usersWithTests, error: usersWithTestsError } = await supabase
        .from('user_test_sessions')
        .select('user_id', { count: 'exact', head: true });

      if (usersWithTestsError) {
        return { stats: null, error: usersWithTestsError.message };
      }

      return {
        stats: {
          totalUsers: totalUsers || 0,
          totalTests: totalTests || 0,
          usersWithTests: usersWithTests || 0,
          completionRate: totalUsers ? ((usersWithTests || 0) / totalUsers * 100).toFixed(1) : 0
        },
        error: null
      };
    } catch {
      return { stats: null, error: 'Failed to fetch statistics' };
    }
  }
}
