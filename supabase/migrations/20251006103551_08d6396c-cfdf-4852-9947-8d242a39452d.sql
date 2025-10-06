-- Fix Profile Table RLS - Restrict to own profile only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Add missing SELECT policy for resumes table
CREATE POLICY "Users can view own resumes" ON public.resumes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);