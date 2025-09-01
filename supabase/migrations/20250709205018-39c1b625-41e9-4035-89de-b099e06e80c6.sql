-- Enhanced guest data management schema for Rivendell Trout Estate

-- Add marketing exclusion reasons lookup table
CREATE TABLE public.marketing_exclusion_reasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reason_code TEXT NOT NULL UNIQUE,
  reason_description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default exclusion reasons
INSERT INTO public.marketing_exclusion_reasons (reason_code, reason_description) VALUES
  ('COMPLAINT', 'Guest made a complaint'),
  ('REQUEST', 'Guest requested to be removed'),
  ('INACTIVE', 'Guest has been inactive for over 2 years'),
  ('BOUNCED', 'Email address bounces consistently'),
  ('UNSUBSCRIBED', 'Guest unsubscribed from marketing'),
  ('GDPR', 'GDPR/POPIA data removal request');

-- Enhanced guest identities table for deduplication and marketing management
CREATE TABLE public.guest_identities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_number TEXT NOT NULL UNIQUE,
  email TEXT,
  primary_name TEXT NOT NULL,
  primary_surname TEXT NOT NULL,
  first_booking_date DATE NOT NULL,
  last_booking_date DATE NOT NULL,
  total_bookings INTEGER DEFAULT 1,
  total_spent NUMERIC DEFAULT 0,
  preferred_cottage TEXT,
  marketing_consent BOOLEAN DEFAULT false,
  marketing_excluded BOOLEAN DEFAULT false,
  exclusion_reason TEXT,
  excluded_by UUID REFERENCES public.profiles(id),
  excluded_at TIMESTAMP WITH TIME ZONE,
  communication_preferences JSONB DEFAULT '{"email": true, "sms": true, "whatsapp": true}'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketing exclusion audit trail
CREATE TABLE public.marketing_exclusion_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_identity_id UUID NOT NULL REFERENCES public.guest_identities(id),
  action TEXT NOT NULL, -- 'excluded', 'included', 'reason_changed'
  previous_status BOOLEAN,
  new_status BOOLEAN,
  previous_reason TEXT,
  new_reason TEXT,
  performed_by UUID NOT NULL REFERENCES public.profiles(id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Add guest_identity_id to guests table for linking
ALTER TABLE public.guests ADD COLUMN guest_identity_id UUID REFERENCES public.guest_identities(id);

-- Create indexes for performance
CREATE INDEX idx_guest_identities_contact_number ON public.guest_identities(contact_number);
CREATE INDEX idx_guest_identities_email ON public.guest_identities(email) WHERE email IS NOT NULL;
CREATE INDEX idx_guest_identities_marketing_excluded ON public.guest_identities(marketing_excluded);
CREATE INDEX idx_guests_guest_identity_id ON public.guests(guest_identity_id);
CREATE INDEX idx_guests_contact_number ON public.guests(contact_number);
CREATE INDEX idx_guests_booking_number ON public.guests(booking_number);
CREATE INDEX idx_guests_check_dates ON public.guests(check_in_date, check_out_date);

-- Enable RLS on new tables
ALTER TABLE public.guest_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_exclusion_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_exclusion_reasons ENABLE ROW LEVEL SECURITY;

-- RLS policies for guest_identities
CREATE POLICY "Admin can manage all guest identities" ON public.guest_identities
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- RLS policies for marketing_exclusion_audit (read-only for auditing)
CREATE POLICY "Admin can view exclusion audit" ON public.marketing_exclusion_audit
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- RLS policies for marketing_exclusion_reasons
CREATE POLICY "Admin can manage exclusion reasons" ON public.marketing_exclusion_reasons
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Function to update marketing exclusion with audit trail
CREATE OR REPLACE FUNCTION public.update_marketing_exclusion(
  guest_identity_id UUID,
  excluded BOOLEAN,
  reason TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
  current_status BOOLEAN;
  current_reason TEXT;
BEGIN
  -- Get current user ID
  SELECT user_id INTO current_user_id 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Get current status
  SELECT marketing_excluded, exclusion_reason 
  INTO current_status, current_reason
  FROM public.guest_identities 
  WHERE id = guest_identity_id;
  
  -- Update guest identity
  UPDATE public.guest_identities SET
    marketing_excluded = excluded,
    exclusion_reason = CASE WHEN excluded THEN reason ELSE NULL END,
    excluded_by = CASE WHEN excluded THEN current_user_id ELSE NULL END,
    excluded_at = CASE WHEN excluded THEN now() ELSE NULL END,
    updated_at = now()
  WHERE id = guest_identity_id;
  
  -- Log the change
  INSERT INTO public.marketing_exclusion_audit (
    guest_identity_id,
    action,
    previous_status,
    new_status,
    previous_reason,
    new_reason,
    performed_by,
    notes
  ) VALUES (
    guest_identity_id,
    CASE 
      WHEN current_status IS NULL AND excluded THEN 'excluded'
      WHEN current_status = true AND NOT excluded THEN 'included'
      WHEN current_status = false AND excluded THEN 'excluded'
      ELSE 'reason_changed'
    END,
    current_status,
    excluded,
    current_reason,
    reason,
    current_user_id,
    notes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically link guests to identities
CREATE OR REPLACE FUNCTION public.link_guest_to_identity()
RETURNS TRIGGER AS $$
DECLARE
  identity_id UUID;
  existing_identity RECORD;
BEGIN
  -- Try to find existing identity by contact number first
  SELECT id INTO existing_identity 
  FROM public.guest_identities 
  WHERE contact_number = NEW.contact_number;
  
  IF existing_identity.id IS NOT NULL THEN
    -- Update existing identity
    UPDATE public.guest_identities SET
      last_booking_date = GREATEST(last_booking_date, NEW.check_in_date),
      total_bookings = total_bookings + 1,
      total_spent = total_spent + COALESCE(NEW.total_amount, 0),
      updated_at = now()
    WHERE id = existing_identity.id;
    
    NEW.guest_identity_id = existing_identity.id;
  ELSE
    -- Create new identity (email will be NULL since guests table doesn't have email)
    INSERT INTO public.guest_identities (
      contact_number,
      email,
      primary_name,
      primary_surname,
      first_booking_date,
      last_booking_date,
      total_spent,
      preferred_cottage,
      marketing_consent,
      communication_preferences
    ) VALUES (
      NEW.contact_number,
      NULL, -- email not available in guests table
      NEW.name,
      NEW.surname,
      NEW.check_in_date,
      NEW.check_in_date,
      COALESCE(NEW.total_amount, 0),
      NEW.cottage_name,
      COALESCE(NEW.marketing_consent, false),
      COALESCE(NEW.communication_preferences, '{"email": true, "sms": true, "whatsapp": true}'::jsonb)
    ) RETURNING id INTO identity_id;
    
    NEW.guest_identity_id = identity_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically link guests to identities
CREATE TRIGGER trigger_link_guest_to_identity
  BEFORE INSERT ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.link_guest_to_identity();

-- Add updated_at trigger to guest_identities
CREATE TRIGGER update_guest_identities_updated_at
  BEFORE UPDATE ON public.guest_identities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();