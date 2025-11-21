# Supabase Migrations

This directory contains database migrations for the TOMO BUSINESS application.

## Migrations

### 20250121000001_create_analytics_tables.sql
Creates analytics infrastructure:
- `card_views` table - tracks profile views with IP, location, user agent
- `card_clicks` table - tracks link clicks with referrer data
- RLS policies for secure access
- Performance indexes

### 20250121000002_add_last_sign_in.sql
Adds user activity tracking:
- `last_sign_in_at` column to users table
- Helper function for updating sign-in timestamp

## How to Run Migrations

### Option 1: Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### Option 2: Manual Execution
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute each migration

### Option 3: Single Command
Run all migrations at once:
```bash
cat supabase/migrations/*.sql | supabase db execute
```

## Migration Order
Migrations are executed in alphabetical order by filename (timestamp prefix ensures correct order):
1. `20250121000001_create_analytics_tables.sql`
2. `20250121000002_add_last_sign_in.sql`

## Rollback
To rollback analytics tables:
```sql
DROP TABLE IF EXISTS card_clicks CASCADE;
DROP TABLE IF EXISTS card_views CASCADE;
```

To rollback last_sign_in:
```sql
ALTER TABLE users DROP COLUMN IF EXISTS last_sign_in_at;
DROP FUNCTION IF EXISTS update_user_last_sign_in();
```
