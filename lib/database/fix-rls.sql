-- Fix RLS (Row Level Security) issues for the admin table
-- Run this in your Supabase SQL Editor

-- Disable RLS on admin table to allow direct access
ALTER TABLE admin DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled but allow access, use this instead:
-- CREATE POLICY "Allow all operations on admin table" ON admin
-- FOR ALL USING (true) WITH CHECK (true);

-- Ensure the admin user exists
INSERT INTO admin (user_id, password) 
VALUES ('admin', 'admin123') 
ON CONFLICT (user_id) DO NOTHING;

-- Verify the admin user was created
SELECT * FROM admin WHERE user_id = 'admin';
