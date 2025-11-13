-- Create readiness_assessments table
CREATE TABLE public.readiness_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_data JSONB NOT NULL,
  overall_score INTEGER,
  technical_score INTEGER,
  soft_skills_score INTEGER,
  experience_score INTEGER,
  project_quality_score INTEGER,
  ai_analysis JSONB,
  recommendations TEXT[],
  strengths TEXT[],
  weaknesses TEXT[],
  action_items TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.readiness_assessments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assessments
CREATE POLICY "Users can view own assessments"
  ON public.readiness_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own assessments
CREATE POLICY "Users can create own assessments"
  ON public.readiness_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own assessments
CREATE POLICY "Users can update own assessments"
  ON public.readiness_assessments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all assessments
CREATE POLICY "Admins can view all assessments"
  ON public.readiness_assessments
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_readiness_assessments_updated_at
  BEFORE UPDATE ON public.readiness_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();