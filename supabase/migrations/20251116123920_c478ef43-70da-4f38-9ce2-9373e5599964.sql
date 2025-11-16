-- Add is_active column to profiles table
ALTER TABLE public.profiles
ADD COLUMN is_active boolean DEFAULT true NOT NULL;

-- Add comment to document the column
COMMENT ON COLUMN public.profiles.is_active IS 'Indicates if the user account is active (true) or suspended (false)';

-- Create index for faster queries on active users
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);
