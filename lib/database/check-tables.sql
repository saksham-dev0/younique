-- Check if tables exist and have data
-- Run this in your Supabase SQL Editor to diagnose issues

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('test_questions', 'test_options', 'admin', 'users');

-- Check if test_questions table has data
SELECT COUNT(*) as question_count FROM test_questions;

-- Check if test_options table has data
SELECT COUNT(*) as option_count FROM test_options;

-- Check if admin table has data
SELECT COUNT(*) as admin_count FROM admin;

-- Check if users table has data
SELECT COUNT(*) as user_count FROM users;

-- Show sample test questions if they exist
SELECT * FROM test_questions ORDER BY question_order LIMIT 3;

-- Show sample test options if they exist
SELECT * FROM test_options ORDER BY question_id, option_order LIMIT 5;
