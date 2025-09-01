-- Add WhatsApp messages table
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id TEXT NOT NULL UNIQUE,
  sender_phone TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- sent, delivered, read, failed
  message_type TEXT NOT NULL DEFAULT 'text', -- text, template, media
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add column mapping configurations table
CREATE TABLE public.import_column_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mapping_name TEXT NOT NULL,
  column_mappings JSONB NOT NULL, -- stores the mapping configuration
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add additional settings for WhatsApp
INSERT INTO public.app_settings (setting_key, setting_value) VALUES
('whatsapp_business_phone', ''),
('whatsapp_access_token', ''),
('whatsapp_verify_token', ''),
('whatsapp_template_portal_link', ''),
('whatsapp_template_service_request', ''),
('whatsapp_template_otp', '');

-- Enable RLS for new tables
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_column_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies for WhatsApp messages
CREATE POLICY "Admin can manage all WhatsApp messages" ON public.whatsapp_messages
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for import column mappings
CREATE POLICY "Admin can manage import mappings" ON public.import_column_mappings
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_whatsapp_messages_updated_at
  BEFORE UPDATE ON public.whatsapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_import_column_mappings_updated_at
  BEFORE UPDATE ON public.import_column_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();