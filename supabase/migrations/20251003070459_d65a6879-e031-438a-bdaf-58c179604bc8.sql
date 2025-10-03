-- Create coding challenges table
CREATE TABLE public.coding_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  starter_code TEXT,
  test_cases JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenge submissions table
CREATE TABLE public.challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.coding_challenges(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'passed', 'failed')),
  test_results JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create competitions table
CREATE TABLE public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  prize_pool TEXT,
  max_participants INTEGER,
  banner_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create competition participants table
CREATE TABLE public.competition_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(competition_id, user_id)
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  criteria TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.coding_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coding_challenges
CREATE POLICY "Anyone can view challenges"
ON public.coding_challenges FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage challenges"
ON public.coding_challenges FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for challenge_submissions
CREATE POLICY "Users can view own submissions"
ON public.challenge_submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own submissions"
ON public.challenge_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for competitions
CREATE POLICY "Anyone can view competitions"
ON public.competitions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage competitions"
ON public.competitions FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for competition_participants
CREATE POLICY "Anyone can view participants"
ON public.competition_participants FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can join competitions"
ON public.competition_participants FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for badges
CREATE POLICY "Anyone can view badges"
ON public.badges FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage badges"
ON public.badges FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_badges
CREATE POLICY "Anyone can view earned badges"
ON public.user_badges FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can view own badges"
ON public.user_badges FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_coding_challenges_updated_at
BEFORE UPDATE ON public.coding_challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.coding_challenges (title, description, difficulty, category, points, starter_code, test_cases, tags) VALUES
('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', 'easy', 'Arrays', 10, 'function twoSum(nums, target) {\n  // Your code here\n}', '{"tests": [{"input": {"nums": [2,7,11,15], "target": 9}, "output": [0,1]}, {"input": {"nums": [3,2,4], "target": 6}, "output": [1,2]}]}', ARRAY['arrays', 'hash-table']),
('Reverse String', 'Write a function that reverses a string.', 'easy', 'Strings', 5, 'function reverseString(s) {\n  // Your code here\n}', '{"tests": [{"input": "hello", "output": "olleh"}, {"input": "world", "output": "dlrow"}]}', ARRAY['strings']),
('Valid Parentheses', 'Given a string containing brackets, determine if the input string is valid.', 'medium', 'Stack', 15, 'function isValid(s) {\n  // Your code here\n}', '{"tests": [{"input": "()", "output": true}, {"input": "()[]{}", "output": true}, {"input": "(]", "output": false}]}', ARRAY['stack', 'strings']);

INSERT INTO public.competitions (title, description, start_date, end_date, prize_pool, max_participants, status) VALUES
('Monthly Coding Sprint', 'Compete with developers worldwide in this monthly coding challenge!', now() + interval '7 days', now() + interval '14 days', '$5000', 1000, 'upcoming'),
('AI Hackathon 2025', 'Build the next generation AI application in 48 hours.', now() + interval '30 days', now() + interval '32 days', '$10000', 500, 'upcoming');

INSERT INTO public.badges (name, description, criteria, points) VALUES
('First Step', 'Complete your first coding challenge', 'complete_1_challenge', 5),
('Problem Solver', 'Complete 10 coding challenges', 'complete_10_challenges', 20),
('Competition Ready', 'Participate in your first competition', 'join_1_competition', 15),
('Elite Coder', 'Complete 50 coding challenges', 'complete_50_challenges', 100);