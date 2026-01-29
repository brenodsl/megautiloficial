-- Create admin_credentials table to store the first-time setup credentials
CREATE TABLE public.admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- No RLS policies needed - we'll access via edge function with service role key
-- This keeps the credentials secure and only accessible server-side