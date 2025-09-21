import { supabase } from '@/lib/supabase/client';
import { Admin, AdminLoginCredentials } from '@/lib/types/auth';

export class AdminAuth {
  // Login admin with hardcoded credentials
  static async login(credentials: AdminLoginCredentials): Promise<{ admin: Admin | null; error: string | null }> {
    try {
      console.log('Attempting admin login with:', credentials);
      
      const { data: admin, error } = await supabase
        .from('admin')
        .select('*')
        .eq('user_id', credentials.user_id)
        .eq('password', credentials.password)
        .single();

      console.log('Supabase response:', { admin, error });

      if (error) {
        console.error('Admin login error:', error);
        return { admin: null, error: `Database error: ${error.message}` };
      }

      if (!admin) {
        return { admin: null, error: 'Invalid admin credentials' };
      }

      return { admin, error: null };
    } catch (error) {
      console.error('Admin login exception:', error);
      return { admin: null, error: 'An unexpected error occurred' };
    }
  }

  // Get current admin from session
  static async getCurrentAdmin(): Promise<Admin | null> {
    try {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        return JSON.parse(adminData);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Set admin session
  static setAdminSession(admin: Admin): void {
    localStorage.setItem('admin', JSON.stringify(admin));
  }

  // Logout admin
  static logout(): void {
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
  }
}
