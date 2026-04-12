-- Link quiz completion to Supabase Auth (magic link). Clear legacy public.users FK values first.
ALTER TABLE public.quiz_sessions
  DROP CONSTRAINT IF EXISTS quiz_sessions_user_id_fkey;

UPDATE public.quiz_sessions
SET user_id = NULL
WHERE user_id IS NOT NULL;

ALTER TABLE public.quiz_sessions
  ADD CONSTRAINT quiz_sessions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE SET NULL;
