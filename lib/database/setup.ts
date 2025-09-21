import { supabase } from '@/lib/supabase/client';

export class DatabaseSetup {
  // Check if admin table exists and has data
  static async checkAdminSetup(): Promise<{ success: boolean; error?: string; adminExists?: boolean }> {
    try {
      console.log('Checking admin table setup...');
      
      // First, try to get all admins to see if table exists
      const { data: admins, error } = await supabase
        .from('admin')
        .select('*');

      if (error) {
        console.error('Error checking admin table:', error);
        
        // If it's an RLS error, provide specific guidance
        if (error.message.includes('row-level security')) {
          return { 
            success: false, 
            error: 'RLS Error: Please run the SQL in lib/database/fix-rls.sql in your Supabase SQL Editor to disable RLS on the admin table' 
          };
        }
        
        return { success: false, error: error.message };
      }

      console.log('Admin table check result:', { admins, error });
      
      const adminExists = admins && admins.length > 0;
      
      if (!adminExists) {
        console.log('No admin found, attempting to create default admin...');
        
        // Try to insert the default admin
        const { data: newAdmin, error: insertError } = await supabase
          .from('admin')
          .insert([{
            user_id: 'admin',
            password: 'admin123'
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating admin:', insertError);
          
          // If it's an RLS error, provide specific guidance
          if (insertError.message.includes('row-level security')) {
            return { 
              success: false, 
              error: 'RLS Error: Please run the SQL in lib/database/fix-rls.sql in your Supabase SQL Editor to disable RLS on the admin table' 
            };
          }
          
          return { success: false, error: insertError.message };
        }

        console.log('Default admin created:', newAdmin);
        return { success: true, adminExists: true };
      }

      return { success: true, adminExists: true };
    } catch (error) {
      console.error('Database setup error:', error);
      return { success: false, error: 'Database connection failed' };
    }
  }

  // Test database connection
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admin')
        .select('count')
        .limit(1);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Connection test failed' };
    }
  }
}
