-- Analytics Tables for TOMO BUSINESS
-- This script safely creates analytics tables with proper type handling

-- Drop existing tables and policies if they exist (clean slate)
DROP POLICY IF EXISTS "Users can read their own card clicks" ON card_clicks;
DROP POLICY IF EXISTS "Allow public to insert card clicks" ON card_clicks;
DROP POLICY IF EXISTS "Users can read their own card views" ON card_views;
DROP POLICY IF EXISTS "Allow public to insert card views" ON card_views;
DROP TABLE IF EXISTS card_clicks;
DROP TABLE IF EXISTS card_views;

-- Card Views Table (using TEXT for card_id to match any ID format)
CREATE TABLE card_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id TEXT NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewer_ip TEXT,
    viewer_country TEXT,
    viewer_city TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card Clicks Table (using TEXT for card_id to match any ID format)
CREATE TABLE card_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id TEXT NOT NULL,
    link_id TEXT,
    link_url TEXT,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewer_ip TEXT,
    viewer_country TEXT,
    viewer_city TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_card_views_card_id ON card_views(card_id);
CREATE INDEX idx_card_views_viewed_at ON card_views(viewed_at);
CREATE INDEX idx_card_clicks_card_id ON card_clicks(card_id);
CREATE INDEX idx_card_clicks_clicked_at ON card_clicks(clicked_at);

-- Enable RLS
ALTER TABLE card_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for card_views
-- Allow anyone to insert views (for public tracking)
CREATE POLICY "Allow public to insert card views" ON card_views
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own card views (handles TEXT card_id properly)
CREATE POLICY "Users can read their own card views" ON card_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM business_cards 
            WHERE business_cards.id::text = card_views.card_id 
            AND business_cards.user_id = auth.uid()
        )
    );

-- RLS Policies for card_clicks
-- Allow anyone to insert clicks (for public tracking)
CREATE POLICY "Allow public to insert card clicks" ON card_clicks
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own card clicks (handles TEXT card_id properly)
CREATE POLICY "Users can read their own card clicks" ON card_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM business_cards 
            WHERE business_cards.id::text = card_clicks.card_id 
            AND business_cards.user_id = auth.uid()
        )
    );

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

-- Trigger to update last_sign_in_at on auth
-- Note: This would need to be set up via Supabase auth hooks in production
