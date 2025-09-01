-- Create a profile for the admin user
-- Replace 'admin@example.com' with the actual email you used to create the admin user
-- You'll need to get the user_id from the auth.users table and update this query

INSERT INTO public.profiles (user_id, email, role)
SELECT 
    id,
    email,
    'admin'
FROM auth.users 
WHERE email LIKE '%@%'  -- This will match any email
LIMIT 1;  -- Just take the first user as admin