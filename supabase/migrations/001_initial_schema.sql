-- R1 initial schema (see CLAUDE.md)
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  shopify_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  marketing_opt_in boolean NOT NULL DEFAULT false,
  account_status text NOT NULL DEFAULT 'active',
  last_login_at timestamptz
);

-- -----------------------------------------------------------------------------
-- consultants (before consultations)
-- -----------------------------------------------------------------------------
CREATE TABLE public.consultants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  derma_concepts_trained boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES public.users (id) ON DELETE CASCADE,
  age_band text,
  hormone_stage text,
  hrt_status text,
  skin_sensitivity text,
  skin_type text,
  skin_oiliness text,
  vitamin_a_experience text,
  primary_concerns text[],
  primary_goals text[],
  pregnancy_status text,
  sun_exposure text,
  lifestyle_notes text,
  is_estrogen_future_candidate boolean NOT NULL DEFAULT false,
  is_consult_recommended boolean NOT NULL DEFAULT false,
  current_protocol_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- quiz_sessions
-- -----------------------------------------------------------------------------
CREATE TABLE public.quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users (id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  traffic_source text,
  quiz_version text NOT NULL DEFAULT 'v1',
  completion_status text NOT NULL DEFAULT 'in_progress',
  abandoned_at_step int
);

-- -----------------------------------------------------------------------------
-- quiz_answers
-- -----------------------------------------------------------------------------
CREATE TABLE public.quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_session_id uuid NOT NULL REFERENCES public.quiz_sessions (id) ON DELETE CASCADE,
  question_key text NOT NULL,
  answer_value text NOT NULL,
  answer_label text,
  answered_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- consultations (final_protocol_id FK added after protocols exist)
-- -----------------------------------------------------------------------------
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  quiz_session_id uuid REFERENCES public.quiz_sessions (id) ON DELETE SET NULL,
  skin_photo_url text,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  assigned_consultant_id uuid REFERENCES public.consultants (id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  consultant_notes text,
  protocol_suggestion_id uuid,
  final_protocol_id uuid,
  turnaround_hours numeric
);

-- -----------------------------------------------------------------------------
-- protocols
-- -----------------------------------------------------------------------------
CREATE TABLE public.protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  quiz_session_id uuid REFERENCES public.quiz_sessions (id) ON DELETE SET NULL,
  consultation_id uuid REFERENCES public.consultations (id) ON DELETE SET NULL,
  protocol_level text NOT NULL,
  age_track text NOT NULL,
  summary_title text,
  summary_copy text,
  education_track text,
  step_up_milestone_days int NOT NULL DEFAULT 90,
  consult_flag boolean NOT NULL DEFAULT false,
  estrogen_future_flag boolean NOT NULL DEFAULT false,
  generated_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  confirmed_by_consultant_id uuid REFERENCES public.consultants (id) ON DELETE SET NULL,
  product_path text NOT NULL
);

ALTER TABLE public.consultations
  ADD CONSTRAINT consultations_final_protocol_id_fkey
  FOREIGN KEY (final_protocol_id) REFERENCES public.protocols (id) ON DELETE SET NULL;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_current_protocol_id_fkey
  FOREIGN KEY (current_protocol_id) REFERENCES public.protocols (id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- protocol_products
-- -----------------------------------------------------------------------------
CREATE TABLE public.protocol_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id uuid NOT NULL REFERENCES public.protocols (id) ON DELETE CASCADE,
  shopify_product_id text NOT NULL,
  shopify_variant_id text,
  role text NOT NULL,
  recommended_order int,
  usage_instructions text,
  step_up_notes text
);

-- -----------------------------------------------------------------------------
-- dashboard_tasks
-- -----------------------------------------------------------------------------
CREATE TABLE public.dashboard_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  protocol_id uuid NOT NULL REFERENCES public.protocols (id) ON DELETE CASCADE,
  task_type text,
  day_offset int NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  cta_type text,
  cta_target text,
  status text NOT NULL DEFAULT 'pending'
);

-- -----------------------------------------------------------------------------
-- Row Level Security (policies to be added per product requirements)
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_tasks ENABLE ROW LEVEL SECURITY;
