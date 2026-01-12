-- Create presence table for live visitors tracking
CREATE TABLE public.presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  page TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;

-- Allow all operations for presence tracking (public access for read/write)
CREATE POLICY "Allow all operations on presence" 
ON public.presence 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create index for efficient queries
CREATE INDEX idx_presence_last_seen ON public.presence (last_seen);
CREATE INDEX idx_presence_page ON public.presence (page);

-- Enable realtime for presence table
ALTER PUBLICATION supabase_realtime ADD TABLE public.presence;