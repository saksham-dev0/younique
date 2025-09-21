-- Simple test data insertion - run this if the main populate script doesn't work
-- Run this in your Supabase SQL Editor

-- First, make sure tables exist (run the main schema.sql first if needed)
-- Then insert test questions one by one

-- Insert Question 1
INSERT INTO test_questions (question_text, question_order) 
VALUES ('What I believe I can contribute to a team:', 1)
ON CONFLICT (question_order) DO NOTHING;

-- Insert Question 2
INSERT INTO test_questions (question_text, question_order) 
VALUES ('If I have a possible shortcoming in teamwork, it could be that:', 2)
ON CONFLICT (question_order) DO NOTHING;

-- Insert Question 3
INSERT INTO test_questions (question_text, question_order) 
VALUES ('When involved in a project with other people:', 3)
ON CONFLICT (question_order) DO NOTHING;

-- Insert Question 4
INSERT INTO test_questions (question_text, question_order) 
VALUES ('My characteristic approach to group work is that:', 4)
ON CONFLICT (question_order) DO NOTHING;

-- Insert Question 5
INSERT INTO test_questions (question_text, question_order) 
VALUES ('I gain satisfaction in a job because:', 5)
ON CONFLICT (question_order) DO NOTHING;

-- Insert Question 6
INSERT INTO test_questions (question_text, question_order) 
VALUES ('If I am suddenly given a difficult task with limited time and unfamiliar people:', 6)
ON CONFLICT (question_order) DO NOTHING;

-- Insert Question 7
INSERT INTO test_questions (question_text, question_order) 
VALUES ('With reference to the problems to which I am subject in working in groups:', 7)
ON CONFLICT (question_order) DO NOTHING;

-- Now insert options for Question 1
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'I think I can quickly see and take advantage of new opportunities.', 1
FROM test_questions WHERE question_order = 1;

INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'I can work well with a very wide range of people.', 2
FROM test_questions WHERE question_order = 1;

INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'Producing ideas is one of my natural assets.', 3
FROM test_questions WHERE question_order = 1;

INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'My ability rests in being able to draw people out whenever I detect they have something of value to contribute to group objectives.', 4
FROM test_questions WHERE question_order = 1;

INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'My capacity to follow through has much to do with my personal effectiveness.', 5
FROM test_questions WHERE question_order = 1;

INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'I am ready to face temporary unpopularity if it leads to worthwhile results in the end.', 6
FROM test_questions WHERE question_order = 1;

INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'I can usually sense what is realistic and likely to work.', 7
FROM test_questions WHERE question_order = 1;

INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, 'I can offer a reasoned case for alternative courses of action without introducing bias or prejudice.', 8
FROM test_questions WHERE question_order = 1;

-- Verify the data was inserted
SELECT 'Questions inserted:' as status, COUNT(*) as count FROM test_questions;
SELECT 'Options inserted:' as status, COUNT(*) as count FROM test_options;
