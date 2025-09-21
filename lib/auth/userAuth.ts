import { supabase } from '@/lib/supabase/client';
import { User, LoginCredentials, SignupData } from '@/lib/types/auth';

export class UserAuth {
  // Sign up a new user
  static async signup(data: SignupData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        return { user: null, error: 'User with this email already exists' };
      }

      // Insert new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          name: data.name,
          email: data.email,
          password: data.password // In production, hash this password
        }])
        .select()
        .single();

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: newUser, error: null };
    } catch {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .eq('password', credentials.password) // In production, compare hashed passwords
        .single();

      if (error) {
        return { user: null, error: 'Invalid email or password' };
      }

      return { user, error: null };
    } catch {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  // Get current user from session
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch {
      return null;
    }
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
  }

  // Set user session
  static setUserSession(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
