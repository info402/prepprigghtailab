
-- Allow authenticated users to post jobs
CREATE POLICY "Authenticated users can post jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = posted_by);

-- Allow users to update their own posted jobs
CREATE POLICY "Users can update own posted jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (auth.uid() = posted_by);
