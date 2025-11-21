-- Add OAuth provider tracking
-- Created: 2025-01-21
-- This migration adds OAuth provider tracking to see how users signed up

-- Add auth_provider column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'auth_provider'
    ) THEN
        ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'email';
    END IF;
END $$;

-- Function to sync auth provider from Supabase auth
CREATE OR REPLACE FUNCTION sync_user_auth_provider()
RETURNS TRIGGER AS $$
DECLARE
    provider_name TEXT;
BEGIN
    -- Get the provider from auth.users
    SELECT 
        COALESCE(
            (raw_app_meta_data->>'provider')::text,
            'email'
        ) INTO provider_name
    FROM auth.users
    WHERE id = NEW.id;
    
    -- Update the users table
    UPDATE users 
    SET auth_provider = provider_name
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-sync provider on user creation
DROP TRIGGER IF EXISTS on_user_created_sync_provider ON users;
CREATE TRIGGER on_user_created_sync_provider
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_auth_provider();

-- Backfill existing users with their auth provider
UPDATE users u
SET auth_provider = COALESCE(
    (SELECT raw_app_meta_data->>'provider' 
     FROM auth.users 
     WHERE auth.users.id = u.id),
    'email'
)
WHERE auth_provider IS NULL OR auth_provider = 'email';
