# Supabase Configuration

This directory contains Supabase-related files including migrations, functions, and configuration.

## Structure
```
supabase/
├── migrations/          # Database migration files
│   ├── 20250121000001_create_analytics_tables.sql
│   ├── 20250121000002_add_last_sign_in.sql
│   └── README.md
└── README.md           # This file
```

## Quick Start

### Run All Migrations
Copy and paste this into Supabase SQL Editor:

```sql
-- Migration 1: Analytics Tables
-- (Copy content from 20250121000001_create_analytics_tables.sql)

-- Migration 2: Last Sign In
-- (Copy content from 20250121000002_add_last_sign_in.sql)
```

Or use the Supabase CLI:
```bash
supabase db push
```

## Environment Variables
Make sure these are set in your Vercel/deployment environment:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key
- `T_SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin API)

## Database Tables
After running migrations, you'll have:
- `users` - User accounts
- `business_cards` - Digital business cards
- `youtube_cards` - YouTube profile cards
- `card_views` - Analytics: profile views
- `card_clicks` - Analytics: link clicks

## Admin Access
Admin features restricted to: `tomoacademyofficial@gmail.com`
