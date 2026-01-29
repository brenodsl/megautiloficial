-- Create funnel_events table for tracking user journey
CREATE TABLE public.funnel_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  page TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_funnel_events_session ON public.funnel_events(session_id);
CREATE INDEX idx_funnel_events_type ON public.funnel_events(event_type);
CREATE INDEX idx_funnel_events_created ON public.funnel_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

-- Allow insert from anyone (anonymous tracking)
CREATE POLICY "Anyone can insert funnel events"
ON public.funnel_events
FOR INSERT
WITH CHECK (true);

-- Allow read for admin operations
CREATE POLICY "Allow read funnel events"
ON public.funnel_events
FOR SELECT
USING (true);

-- Enable realtime for funnel events
ALTER PUBLICATION supabase_realtime ADD TABLE public.funnel_events;