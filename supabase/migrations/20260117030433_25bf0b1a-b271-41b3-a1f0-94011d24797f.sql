-- Create gateway_settings table to store payment gateway configurations
CREATE TABLE public.gateway_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gateway_name TEXT NOT NULL UNIQUE,
  api_token TEXT NOT NULL,
  product_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gateway_settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations (admin only access controlled by app logic)
CREATE POLICY "Allow all operations on gateway_settings" 
ON public.gateway_settings 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gateway_settings_updated_at
BEFORE UPDATE ON public.gateway_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default gateway configurations
INSERT INTO public.gateway_settings (gateway_name, api_token, product_id, is_active) VALUES
('sigmapay', '', '', false),
('goatpay', '', '', true);