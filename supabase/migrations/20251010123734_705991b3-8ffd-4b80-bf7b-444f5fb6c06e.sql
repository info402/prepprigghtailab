-- Create user tokens table
CREATE TABLE public.user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_tokens INTEGER NOT NULL DEFAULT 100,
  used_tokens INTEGER NOT NULL DEFAULT 0,
  remaining_tokens INTEGER GENERATED ALWAYS AS (total_tokens - used_tokens) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free',
  is_active BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_tokens
CREATE POLICY "Users can view own tokens"
  ON public.user_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens"
  ON public.user_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to give new users 100 tokens
CREATE OR REPLACE FUNCTION public.initialize_user_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_tokens (user_id, total_tokens, used_tokens)
  VALUES (NEW.id, 100, 0);
  
  INSERT INTO public.subscriptions (user_id, plan_type, is_active)
  VALUES (NEW.id, 'free', true);
  
  RETURN NEW;
END;
$$;

-- Trigger to initialize tokens for new users
CREATE TRIGGER on_user_created_initialize_tokens
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_tokens();

-- Function to update updated_at timestamp
CREATE TRIGGER update_user_tokens_updated_at
  BEFORE UPDATE ON public.user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();