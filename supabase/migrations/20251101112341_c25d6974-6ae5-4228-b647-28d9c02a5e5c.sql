-- Fix vouchers table RLS policies
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view active vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Authenticated users can create vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Creators can update own vouchers" ON public.vouchers;

-- Create admin-only policies for voucher management
CREATE POLICY "Admins can manage all vouchers" 
ON public.vouchers 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated users to view active vouchers
CREATE POLICY "Users can view active vouchers" 
ON public.vouchers 
FOR SELECT 
USING ((expiry_date IS NULL) OR (expiry_date > now()));

-- Add admin oversight for events table
-- Keep existing policies for event hosts, but add admin access
CREATE POLICY "Admins can manage all events" 
ON public.events 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));