-- Diagnose admin dashboard issues
-- Run this in your Supabase SQL Editor to check for data problems

-- Check if tables exist
SELECT 'Tables check:' as check_type;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_test_sessions', 'user_test_responses', 'test_questions', 'test_options', 'admin');

-- Check users table
SELECT 'Users table:' as check_type;
SELECT COUNT(*) as user_count FROM users;
SELECT id, name, email, created_at FROM users LIMIT 5;

-- Check user_test_sessions table
SELECT 'User test sessions:' as check_type;
SELECT COUNT(*) as session_count FROM user_test_sessions;
SELECT user_id, completed_at, created_at FROM user_test_sessions LIMIT 5;

-- Check user_test_responses table
SELECT 'User test responses:' as check_type;
SELECT COUNT(*) as response_count FROM user_test_responses;
SELECT user_id, question_id, option_id, points, created_at FROM user_test_responses LIMIT 5;

-- Check for null or invalid timestamps
SELECT 'Timestamp issues:' as check_type;
SELECT 'Sessions with null completed_at:' as issue, COUNT(*) as count 
FROM user_test_sessions 
WHERE completed_at IS NULL;

SELECT 'Sessions with null created_at:' as issue, COUNT(*) as count 
FROM user_test_sessions 
WHERE created_at IS NULL;

-- Check test questions and options
SELECT 'Test questions:' as check_type;
SELECT COUNT(*) as question_count FROM test_questions;
SELECT id, question_text, question_order FROM test_questions ORDER BY question_order;

SELECT 'Test options:' as check_type;
SELECT COUNT(*) as option_count FROM test_options;
SELECT question_id, option_text, option_order FROM test_options ORDER BY question_id, option_order LIMIT 10;
