-- Create project_templates table for starter projects
CREATE TABLE public.project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  starter_code_url TEXT,
  demo_url TEXT,
  features TEXT[] DEFAULT '{}',
  estimated_time TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can view active templates
CREATE POLICY "Anyone can view active templates" 
ON public.project_templates 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage templates
CREATE POLICY "Admins can manage templates" 
ON public.project_templates 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create user_projects table to track student projects
CREATE TABLE public.user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.project_templates(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_repo_url TEXT,
  deployed_url TEXT,
  deployment_platform TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'deployed', 'archived')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_deployed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

-- Users can manage their own projects
CREATE POLICY "Users can manage own projects" 
ON public.user_projects 
FOR ALL 
USING (auth.uid() = user_id);

-- Anyone can view completed/deployed projects (for portfolio)
CREATE POLICY "Anyone can view public projects" 
ON public.user_projects 
FOR SELECT 
USING (status IN ('completed', 'deployed'));

-- Admins can view all projects
CREATE POLICY "Admins can view all projects" 
ON public.user_projects 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_user_projects_updated_at
BEFORE UPDATE ON public.user_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some starter templates
INSERT INTO public.project_templates (name, description, category, tech_stack, difficulty, features, estimated_time, icon) VALUES
('AI Chatbot MVP', 'Build a conversational AI chatbot with natural language processing', 'AI/ML', ARRAY['React', 'Node.js', 'OpenAI API', 'Express'], 'intermediate', ARRAY['Natural Language Processing', 'Context Memory', 'Real-time Chat', 'API Integration'], '2-3 weeks', '🤖'),
('E-commerce Store', 'Full-stack online store with payment integration', 'Web Development', ARRAY['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'], 'advanced', ARRAY['Product Management', 'Shopping Cart', 'Payment Processing', 'Admin Dashboard'], '4-6 weeks', '🛒'),
('Task Management App', 'Collaborative task tracker with real-time updates', 'Productivity', ARRAY['React', 'Firebase', 'Material-UI'], 'beginner', ARRAY['CRUD Operations', 'User Authentication', 'Real-time Sync', 'Drag & Drop'], '1-2 weeks', '✅'),
('Social Media Dashboard', 'Analytics dashboard for social media metrics', 'Analytics', ARRAY['React', 'D3.js', 'Node.js', 'MongoDB'], 'intermediate', ARRAY['Data Visualization', 'API Integration', 'Charts & Graphs', 'Export Reports'], '2-3 weeks', '📊'),
('Portfolio Website', 'Personal portfolio with blog and project showcase', 'Web Development', ARRAY['Next.js', 'MDX', 'Tailwind', 'Vercel'], 'beginner', ARRAY['Responsive Design', 'Blog System', 'SEO Optimization', 'Contact Form'], '1 week', '💼'),
('Weather App', 'Real-time weather forecast application', 'Web Development', ARRAY['React', 'Weather API', 'Chart.js'], 'beginner', ARRAY['API Integration', 'Geolocation', 'Data Visualization', 'PWA'], '3-5 days', '🌤️'),
('Expense Tracker', 'Track income and expenses with visualizations', 'Finance', ARRAY['React', 'Node.js', 'PostgreSQL', 'Recharts'], 'intermediate', ARRAY['Budget Management', 'Category Tracking', 'Monthly Reports', 'Export CSV'], '2 weeks', '💰'),
('AI Image Generator', 'Generate images from text descriptions', 'AI/ML', ARRAY['React', 'DALL-E API', 'Node.js'], 'intermediate', ARRAY['Image Generation', 'Prompt Engineering', 'Gallery System', 'Download Options'], '1-2 weeks', '🎨'),
('Fitness Tracker', 'Track workouts and nutrition with progress charts', 'Health', ARRAY['React Native', 'Firebase', 'Chart.js'], 'intermediate', ARRAY['Workout Logging', 'Nutrition Tracking', 'Progress Charts', 'Goal Setting'], '3-4 weeks', '💪'),
('Recipe Finder', 'Search and save recipes with meal planning', 'Food', ARRAY['React', 'Spoonacular API', 'Redux'], 'beginner', ARRAY['Recipe Search', 'Save Favorites', 'Meal Planning', 'Shopping List'], '1-2 weeks', '🍳');