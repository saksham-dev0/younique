-- SQL to populate test questions and options for Task Maturity Test
-- Run this in your Supabase SQL Editor

-- First, clear existing test data (optional - remove if you want to keep existing data)
DELETE FROM user_test_responses;
DELETE FROM test_options;
DELETE FROM test_questions;

-- Insert the 7 test questions
INSERT INTO test_questions (question_text, question_order) VALUES
('What I believe I can contribute to a team:', 1),
('If I have a possible shortcoming in teamwork, it could be that:', 2),
('When involved in a project with other people:', 3),
('My characteristic approach to group work is that:', 4),
('I gain satisfaction in a job because:', 5),
('If I am suddenly given a difficult task with limited time and unfamiliar people:', 6),
('With reference to the problems to which I am subject in working in groups:', 7);

-- Question 1: What I believe I can contribute to a team
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('I think I can quickly see and take advantage of new opportunities.', 1),
  ('I can work well with a very wide range of people.', 2),
  ('Producing ideas is one of my natural assets.', 3),
  ('My ability rests in being able to draw people out whenever I detect they have something of value to contribute to group objectives.', 4),
  ('My capacity to follow through has much to do with my personal effectiveness.', 5),
  ('I am ready to face temporary unpopularity if it leads to worthwhile results in the end.', 6),
  ('I can usually sense what is realistic and likely to work.', 7),
  ('I can offer a reasoned case for alternative courses of action without introducing bias or prejudice.', 8)
) AS options(option_text, option_order) WHERE question_order = 1;

-- Question 2: If I have a possible shortcoming in teamwork, it could be that
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('I am not at ease unless meetings are well structured and controlled and generally well conducted.', 1),
  ('I am inclined to be too generous towards others who have a valid viewpoint that has not been given a proper airing', 2),
  ('I have a tendency to talk too much once the group gets on to new ideas.', 3),
  ('My objective outlook makes it difficult for me to join in readily and enthusiastically with colleagues.', 4),
  ('I am sometimes seen as forceful and authoritarian if there is a need to get something done.', 5),
  ('I find it difficult to lead from the front, perhaps because I am over responsive to group atmosphere.', 6),
  ('I am apt to get too caught up on ideas that occur to me and so lose track of what is happening.', 7),
  ('My colleagues tend to see me as worrying unnecessarily over detail and the possibility that things may go wrong.', 8)
) AS options(option_text, option_order) WHERE question_order = 2;

-- Question 3: When involved in a project with other people
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('I have an aptitude for influencing people without pressurising them.', 1),
  ('My general vigilance prevents careless mistakes and omissions being made', 2),
  ('I am ready to press for action to make sure that the meeting does not waste time or lose sight of the main objective.', 3),
  ('I can be counted on to contribute something original.', 4),
  ('I am always ready to back a good suggestion in the common interest.', 5),
  ('I am keen to look for the latest in new ideas and developments.', 6),
  ('I believe my capacity for judgement can help to bring about the right decisions.', 7),
  ('I can be relied upon to see that all essential work is organized.', 8)
) AS options(option_text, option_order) WHERE question_order = 3;

-- Question 4: My characteristic approach to group work is that
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('I have a quiet interest in getting to know colleagues better.', 1),
  ('I am not reluctant to challenge the views of others or to hold a minority view myself.', 2),
  ('I can usually find a line of argument to refute unsound propositions.', 3),
  ('I think I have a talent for making things work once a plan has to be put into operation.', 4),
  ('I have a tendency to avoid the obvious and to come out with the unexpected.', 5),
  ('I bring a touch of perfectionism to any job i undertake.', 6),
  ('I am ready to make use of contacts outside the group itself.', 7),
  ('While I am interested in all views I have no hesitation in making up my mind once a decision has to be made.', 8)
) AS options(option_text, option_order) WHERE question_order = 4;

-- Question 5: I gain satisfaction in a job because
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('I enjoy analysing situations and weighing up all the possible choices.', 1),
  ('I am interested in finding practical solutions to problems.', 2),
  ('I like to feel I am fostering good working relationships.', 3),
  ('I can have a strong influence on decisions.', 4),
  ('I can meet people who may have something new to offer.', 5),
  ('I can get people to agree on a necessary course of action.', 6),
  ('I feel in my element where I can give a task my full attention.', 7),
  ('I like to find a field that stretches my imagination.', 8)
) AS options(option_text, option_order) WHERE question_order = 5;

-- Question 6: If I am suddenly given a difficult task with limited time and unfamiliar people
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('I would feel like retiring to a corner to devise a way out of the impasses before developing a line of action.', 1),
  ('I would be ready to work with the person who showed the most positive approach.', 2),
  ('I would find some way of reducing the size of the task by establishing what different individuals might best contribute.', 3),
  ('My natural sense of urgency would help to ensure that we did not fall behind schedule.', 4),
  ('I believe I would keep cool and maintain my capacity to think straight.', 5),
  ('I would retain a steadiness of purpose in spite of the pressures.', 6),
  ('I would be prepared to take a positive lead if I felt the group was making no progress', 7),
  ('I would open up discussions with a view to stimulating new thoughts and getting something moving.', 8)
) AS options(option_text, option_order) WHERE question_order = 6;

-- Question 7: With reference to the problems to which I am subject in working in groups
INSERT INTO test_options (question_id, option_text, option_order) 
SELECT id, option_text, option_order FROM test_questions, (VALUES
  ('I am apt to show my impatience with those who are obstructing progress.', 1),
  ('Others may criticise me for being too analytical and insufficiently intuitive.', 2),
  ('My desire to ensure that work is properly done can hold up proceedings.', 3),
  ('I tend to do get bored rather easily and rely on one or two stimulating members to spark me off.', 4),
  ('I find it difficult to get started unless the goals are clear.', 5),
  ('I am sometimes poor at explaining and clarifying complex points that occur to me.', 6),
  ('I am conscious of demanding from others the things I cannot do myself.', 7),
  ('I hesitate to get my points across when I run up against real opposition.', 8)
) AS options(option_text, option_order) WHERE question_order = 7;

-- Verify the data was inserted correctly
SELECT 
  tq.question_order,
  tq.question_text,
  COUNT(to_opt.id) as option_count
FROM test_questions tq
LEFT JOIN test_options to_opt ON tq.id = to_opt.question_id
GROUP BY tq.id, tq.question_order, tq.question_text
ORDER BY tq.question_order;

-- Show sample options for verification
SELECT 
  tq.question_order,
  tq.question_text,
  to_opt.option_order,
  to_opt.option_text
FROM test_questions tq
JOIN test_options to_opt ON tq.id = to_opt.question_id
WHERE tq.question_order = 1
ORDER BY to_opt.option_order;
