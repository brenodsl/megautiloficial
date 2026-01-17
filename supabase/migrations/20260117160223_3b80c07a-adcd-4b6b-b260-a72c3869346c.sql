-- Add gateway_used column to orders table
ALTER TABLE public.orders 
ADD COLUMN gateway_used text DEFAULT NULL;