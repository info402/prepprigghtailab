-- Create events table for student-hosted events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'quiz', 'competition', 'hackathon', 'workshop'
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  prize_details TEXT,
  banner_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time_limit INTEGER, -- in minutes
  passing_score INTEGER,
  total_points INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'multiple_choice', 'true_false', 'short_answer'
  options JSONB, -- for multiple choice options
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER,
  total_points INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_taken INTEGER, -- in seconds
  UNIQUE(quiz_id, user_id)
);

-- Create vouchers table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT, -- 'percentage', 'fixed', 'gift'
  discount_value TEXT,
  company_name TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  voucher_image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event vouchers mapping (which vouchers are available for which events)
CREATE TABLE IF NOT EXISTS public.event_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  rank_requirement INTEGER, -- e.g., 1 for first place, 2 for second, etc.
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, voucher_id, rank_requirement)
);

-- Create user vouchers (won vouchers)
CREATE TABLE IF NOT EXISTS public.user_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  rank_achieved INTEGER,
  is_used BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create event participants table
CREATE TABLE IF NOT EXISTS public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (status != 'cancelled');

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete own events" ON public.events
  FOR DELETE USING (auth.uid() = host_id);

-- RLS Policies for quizzes
CREATE POLICY "Anyone can view published quizzes" ON public.quizzes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Hosts can manage own quizzes" ON public.quizzes
  FOR ALL USING (auth.uid() = host_id);

-- RLS Policies for quiz questions
CREATE POLICY "Users can view quiz questions" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_questions.quiz_id 
      AND quizzes.is_published = true
    )
  );

CREATE POLICY "Quiz hosts can manage questions" ON public.quiz_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_questions.quiz_id 
      AND quizzes.host_id = auth.uid()
    )
  );

-- RLS Policies for quiz attempts
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Quiz hosts can view all attempts" ON public.quiz_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.host_id = auth.uid()
    )
  );

-- RLS Policies for vouchers
CREATE POLICY "Anyone can view active vouchers" ON public.vouchers
  FOR SELECT USING (
    expiry_date IS NULL OR expiry_date > NOW()
  );

CREATE POLICY "Authenticated users can create vouchers" ON public.vouchers
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update own vouchers" ON public.vouchers
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for event vouchers
CREATE POLICY "Anyone can view event vouchers" ON public.event_vouchers
  FOR SELECT USING (true);

CREATE POLICY "Event hosts can manage event vouchers" ON public.event_vouchers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_vouchers.event_id 
      AND events.host_id = auth.uid()
    )
  );

-- RLS Policies for user vouchers
CREATE POLICY "Users can view own vouchers" ON public.user_vouchers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can assign vouchers" ON public.user_vouchers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own vouchers" ON public.user_vouchers
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for event participants
CREATE POLICY "Anyone can view participants" ON public.event_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join events" ON public.event_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Event hosts can update participants" ON public.event_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_participants.event_id 
      AND events.host_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_events_host_id ON public.events(host_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_quizzes_host_id ON public.quizzes(host_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_user_vouchers_user_id ON public.user_vouchers(user_id);
CREATE INDEX idx_event_participants_event_id ON public.event_participants(event_id);