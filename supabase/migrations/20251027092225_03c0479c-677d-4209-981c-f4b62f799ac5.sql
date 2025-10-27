-- Create purpose_profiles table for Purpose Engine
CREATE TABLE IF NOT EXISTS public.purpose_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interests TEXT NOT NULL,
  career_goals TEXT NOT NULL,
  learning_style TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  passions TEXT,
  challenges TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.purpose_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own purpose profile"
  ON public.purpose_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purpose profile"
  ON public.purpose_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purpose profile"
  ON public.purpose_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_purpose_profiles_updated_at
  BEFORE UPDATE ON public.purpose_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();