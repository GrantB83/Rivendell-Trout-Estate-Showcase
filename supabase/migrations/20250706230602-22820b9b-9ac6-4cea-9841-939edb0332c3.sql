-- Create enum for service request types
CREATE TYPE public.service_request_type AS ENUM (
  'firewood',
  'braai_pack',
  'breakfast_basket',
  'cleaning',
  'other'
);

-- Create enum for service request status
CREATE TYPE public.service_request_status AS ENUM (
  'pending',
  'in_progress',
  'delivered',
  'cancelled'
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  booking_number TEXT NOT NULL UNIQUE,
  cottage_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gate codes table
CREATE TABLE public.gate_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cottage_name TEXT NOT NULL,
  code TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cottage directions table
CREATE TABLE public.cottage_directions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cottage_name TEXT NOT NULL UNIQUE,
  directions TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity suggestions table
CREATE TABLE public.activity_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  request_type service_request_type NOT NULL,
  notes TEXT,
  status service_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create app settings table
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cottage_directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for guests table
CREATE POLICY "Admin can manage all guests" ON public.guests
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Guests can view their own data" ON public.guests
FOR SELECT USING (
  contact_number = auth.jwt() ->> 'phone' AND
  CURRENT_DATE BETWEEN check_in_date AND check_out_date
);

-- Create policies for gate codes table
CREATE POLICY "Admin can manage gate codes" ON public.gate_codes
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Guests can view current gate codes" ON public.gate_codes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.guests 
    WHERE cottage_name = gate_codes.cottage_name 
    AND contact_number = auth.jwt() ->> 'phone'
    AND CURRENT_DATE BETWEEN check_in_date AND check_out_date
    AND CURRENT_DATE BETWEEN gate_codes.start_date AND gate_codes.end_date
  )
);

-- Create policies for cottage directions
CREATE POLICY "Admin can manage directions" ON public.cottage_directions
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Guests can view their cottage directions" ON public.cottage_directions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.guests 
    WHERE cottage_name = cottage_directions.cottage_name 
    AND contact_number = auth.jwt() ->> 'phone'
    AND CURRENT_DATE BETWEEN check_in_date AND check_out_date
  )
);

-- Create policies for activity suggestions
CREATE POLICY "Admin can manage activities" ON public.activity_suggestions
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Anyone can view activities" ON public.activity_suggestions
FOR SELECT USING (true);

-- Create policies for service requests
CREATE POLICY "Admin can manage all service requests" ON public.service_requests
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Guests can manage their own service requests" ON public.service_requests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.guests 
    WHERE id = service_requests.guest_id 
    AND contact_number = auth.jwt() ->> 'phone'
    AND CURRENT_DATE BETWEEN check_in_date AND check_out_date
  )
);

-- Create policies for app settings
CREATE POLICY "Admin can manage app settings" ON public.app_settings
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by owner" ON public.profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Profiles can be updated by owner" ON public.profiles
FOR UPDATE USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gate_codes_updated_at
  BEFORE UPDATE ON public.gate_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cottage_directions_updated_at
  BEFORE UPDATE ON public.cottage_directions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_suggestions_updated_at
  BEFORE UPDATE ON public.activity_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default app settings
INSERT INTO public.app_settings (setting_key, setting_value) VALUES
('weather_city', 'Lydenburg'),
('guesthouse_coordinates', '-25.0936,30.4732');