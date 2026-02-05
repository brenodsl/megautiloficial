-- Enable realtime for orders table to get real-time notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;