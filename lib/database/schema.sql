-- Database Schema for Task Maturity Test

-- Admin table (hardcoded credentials)
CREATE TABLE IF NOT EXISTS admin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin credentials
INSERT INTO admin (user_id, password) 
VALUES ('admin', 'admin123') 
ON CONFLICT (user_id) DO NOTHING;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test questions table
CREATE TABLE IF NOT EXISTS test_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test options table (8 options per question)
CREATE TABLE IF NOT EXISTS test_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES test_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User test responses table
CREATE TABLE IF NOT EXISTS user_test_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES test_questions(id) ON DELETE CASCADE,
  option_id UUID REFERENCES test_options(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id, option_id)
);

-- User test sessions table (to track completed tests)
CREATE TABLE IF NOT EXISTS user_test_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_score INTEGER DEFAULT 0
);

-- Insert sample test questions and options
INSERT INTO test_questions (question_text, question_order) VALUES
('How do you typically approach new tasks?', 1),
('What motivates you most in your work?', 2),
('How do you handle deadlines?', 3),
('What is your preferred communication style?', 4),
('How do you deal with challenges?', 5),
('What type of feedback do you prefer?', 6),
('How do you prioritize your work?', 7);

-- Insert options for each question (8 options per question)
-- Question 1: How do you typically approach new tasks?
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('Plan everything in detail before starting', 1),
  ('Jump in and learn as you go', 2),
  ('Research best practices first', 3),
  ('Ask for guidance from experienced colleagues', 4),
  ('Break it down into smaller steps', 5),
  ('Start with the easiest parts', 6),
  ('Focus on the end goal and work backwards', 7),
  ('Experiment with different approaches', 8)
) AS options(option_text, option_order) WHERE question_order = 1;

-- Question 2: What motivates you most in your work?
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('Recognition and praise from others', 1),
  ('Personal growth and learning', 2),
  ('Financial rewards and benefits', 3),
  ('Helping others and making a difference', 4),
  ('Creative freedom and autonomy', 5),
  ('Team collaboration and camaraderie', 6),
  ('Challenging and complex problems', 7),
  ('Stability and job security', 8)
) AS options(option_text, option_order) WHERE question_order = 2;

-- Question 3: How do you handle deadlines?
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('Always finish well before the deadline', 1),
  ('Work steadily and meet the deadline exactly', 2),
  ('Push yourself to work faster under pressure', 3),
  ('Ask for deadline extensions when needed', 4),
  ('Prioritize quality over speed', 5),
  ('Delegate tasks to meet deadlines', 6),
  ('Work extra hours to ensure completion', 7),
  ('Focus on the most critical parts first', 8)
) AS options(option_text, option_order) WHERE question_order = 3;

-- Question 4: What is your preferred communication style?
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('Direct and to the point', 1),
  ('Detailed and comprehensive', 2),
  ('Visual and interactive', 3),
  ('Written documentation', 4),
  ('Face-to-face conversations', 5),
  ('Group discussions and meetings', 6),
  ('Email and digital communication', 7),
  ('Informal and casual', 8)
) AS options(option_text, option_order) WHERE question_order = 4;

-- Question 5: How do you deal with challenges?
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('Analyze the problem thoroughly', 1),
  ('Seek help from others immediately', 2),
  ('Try multiple solutions quickly', 3),
  ('Take a break and come back fresh', 4),
  ('Break the challenge into smaller parts', 5),
  ('Look for similar past experiences', 6),
  ('Research solutions online or in books', 7),
  ('Trust your instincts and intuition', 8)
) AS options(option_text, option_order) WHERE question_order = 5;

-- Question 6: What type of feedback do you prefer?
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('Immediate and frequent feedback', 1),
  ('Detailed written feedback', 2),
  ('Constructive criticism with solutions', 3),
  ('Positive reinforcement and encouragement', 4),
  ('Peer feedback from colleagues', 5),
  ('Anonymous feedback surveys', 6),
  ('One-on-one discussions', 7),
  ('Public recognition and praise', 8)
) AS options(option_text, option_order) WHERE question_order = 6;

-- Question 7: How do you prioritize your work?
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('By deadline urgency', 1),
  ('By importance and impact', 2),
  ('By personal interest and motivation', 3),
  ('By difficulty level', 4),
  ('By stakeholder requests', 5),
  ('By team dependencies', 6),
  ('By potential learning opportunities', 7),
  ('By available time and energy', 8)
) AS options(option_text, option_order) WHERE question_order = 7;
