-- Create app_settings table for upsell configuration
CREATE TABLE public.app_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key text NOT NULL UNIQUE,
    setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read on app_settings"
ON public.app_settings
FOR SELECT
USING (true);

-- Allow all operations (admin will control via auth)
CREATE POLICY "Allow all operations on app_settings"
ON public.app_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert default upsell setting
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('upsell_config', '{"enabled": true, "redirect_url": "/upsell"}'::jsonb);