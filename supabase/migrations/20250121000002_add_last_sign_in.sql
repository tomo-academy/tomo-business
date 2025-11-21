-- Add last_sign_in_at to users table
-- Created: 2025-01-21
-- This migration adds last sign in tracking for admin dashboard

-- Add last_sign_in_at column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_sign_in_at'
    ) THEN
        ALTER TABLE users ADD COLUMN last_sign_in_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Function to update last_sign_in_at
CREATE OR REPLACE FUNCTION update_user_last_sign_in()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_sign_in_at = NOW() 
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Trigger would need to be set up via Supabase auth hooks
-- This function can be called manually or via webhook when user signs in
