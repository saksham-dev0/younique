-- Range Determination and Response Tables for Test Results
-- Run this in your Supabase SQL Editor

-- Range Determination Table (for determining Low/Average/High based on scores)
CREATE TABLE IF NOT EXISTS range_determination (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension_name TEXT NOT NULL,
  dimension_order INTEGER NOT NULL,
  column_1 TEXT, -- Low range
  column_2 TEXT, -- Low range
  column_3 TEXT, -- Average range
  column_4 TEXT, -- Average range
  column_5 TEXT, -- Average range
  column_6 TEXT, -- High range
  column_7 TEXT, -- High range
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Range Response Table (for showing descriptions based on Low/Average/High)
CREATE TABLE IF NOT EXISTS range_response (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension_name TEXT NOT NULL,
  dimension_order INTEGER NOT NULL,
  average_description TEXT NOT NULL,
  high_description TEXT NOT NULL,
  low_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Range Determination Data
-- Column 1-2: Low (>=7 and 8-9)
-- Column 3-5: Average (10 to 13) 
-- Column 6-7: High (14 to <=17)
INSERT INTO range_determination (dimension_name, dimension_order, column_1, column_2, column_3, column_4, column_5, column_6, column_7) VALUES
('Task receptivity orientation', 1, '>=7', '8-9', '10', '11', '12-13', '14-16', '<=17'),
('Task ownership orientation', 2, '>=7', '8-9', '10', '11', '12-13', '14-16', '<=17'),
('Values spending time to shape tasks', 3, '>=7', '8-9', '10', '11', '12-13', '14-16', '<=17'),
('Puts task in reality context', 4, '>=7', '8-9', '10', '11', '12-13', '14-16', '<=17'),
('Prepares for resources before hand', 5, '>=7', '8-9', '10', '11', '12-13', '14-16', '<=17'),
('Sets milestones and measures for critical stages of task', 6, '>=7', '8-9', '10', '11', '12-13', '14-16', '<=17'),
('Sets teams around tasks', 7, '>=7', '8-9', '10', '11', '12-13', '14-16', '<=17');

-- Insert Range Response Data
INSERT INTO range_response (dimension_name, dimension_order, average_description, high_description, low_description) VALUES
('Task receptivity orientation', 1, 'Conservative, dutiful, predictable', 'Organising ability, practical common-sense, hardworking, self-discipline', 'Lack of flexibility, unresponsiveness to unproven ideas'),
('Task ownership orientation', 2, 'Calm, self-confident, controlled', 'Capacity for treating and welcoming all potential contributors on their merits and without prejudice - a strong sense of objectives', 'No more than ordinary in terms of intellect or creative ability'),
('Values spending time to shape tasks', 3, 'Highly strong, outgoing, dynamic', 'Drive and a readiness to challenge inertia, ineffectiveness, complacency or self deception', 'Proneness to provocation, irritation and impatience'),
('Puts task in reality context', 4, 'Individualistic, serious-minded, unorthodox', 'Genius, imagination, intellect, knowledge', 'Up in the clouds, inclined to disregard practical details or protocol'),
('Prepares for resources before hand', 5, 'Extroverted, enthusiastic, curious, communicative', 'A capacity for contacting people and exploring anything new. An ability to respond to challenge', 'Liable to lose interest once the initial fascination has passed'),
('Sets milestones and measures for critical stages of task', 6, 'Sober, unemotional, prudent', 'Judgment, discretion, hard-handedness', 'Lacks inspiration or the ability to motivate others'),
('Sets teams around tasks', 7, 'Socially oriented, rather mild, sensitive', 'An ability to respond to people and to situations, and to promote team spirit', 'Indecisiveness at moments of crisis'),
('Focus on Completion of tasks', 8, 'Painstaking, orderly, conscientious, anxious', 'A capacity for follow-through perfectionism', 'A tendency to worry about small things. A reluctance to "let go"');

-- Disable RLS on these tables
ALTER TABLE range_determination DISABLE ROW LEVEL SECURITY;
ALTER TABLE range_response DISABLE ROW LEVEL SECURITY;
