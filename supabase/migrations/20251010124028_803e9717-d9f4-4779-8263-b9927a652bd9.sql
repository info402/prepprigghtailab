-- Initialize tokens and subscriptions for existing users who don't have them yet
INSERT INTO public.user_tokens (user_id, total_tokens, used_tokens)
SELECT id, 100, 0
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_tokens)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.subscriptions (user_id, plan_type, is_active)
SELECT id, 'free', true
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.subscriptions)
ON CONFLICT (user_id) DO NOTHING;