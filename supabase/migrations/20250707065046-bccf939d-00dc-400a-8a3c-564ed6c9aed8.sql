-- Insert a test guest for portal testing
INSERT INTO public.guests (
  name, 
  surname, 
  booking_number, 
  cottage_name, 
  contact_number, 
  check_in_date, 
  check_out_date
) VALUES (
  'John',
  'Doe', 
  'TEST001',
  'Hobbiton Cottage',
  '+27821234567',
  CURRENT_DATE - INTERVAL '1 day',
  CURRENT_DATE + INTERVAL '7 days'
);