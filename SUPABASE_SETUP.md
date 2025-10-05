# Supabase Setup Guide

## Step 1: Get Your Supabase Project URL

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)

## Step 2: Update Environment Variables

Open `.env.local` and update:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_-5cq3vJR1HHcMkTeYtgUqA_pWuxklYB
```

Replace `https://your-project-id.supabase.co` with your actual Project URL.

## Step 3: Create Database Tables

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to execute the SQL

This will create:
- `health_reports` table to store analysis results
- Indexes for better performance
- Row Level Security policies
- Storage bucket for file uploads

## Step 4: Verify Setup

After running the SQL:
1. Go to **Table Editor** in Supabase Dashboard
2. You should see `health_reports` table
3. Go to **Storage** → You should see `health-reports` bucket

## Step 5: Test the Integration

1. Restart your dev server: `npm run dev`
2. Upload a health report
3. Check Supabase Dashboard → **Table Editor** → `health_reports`
4. You should see your report saved!

## Database Schema

### health_reports table:
- `id` (UUID) - Primary key
- `user_email` (TEXT) - Optional user email
- `file_name` (TEXT) - Original filename
- `file_size` (BIGINT) - File size in bytes
- `file_type` (TEXT) - MIME type
- `file_url` (TEXT) - Storage URL (optional)
- `analysis` (TEXT) - AI-generated analysis
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update time

## API Endpoints Created

1. **POST /api/analyze-report** - Analyzes report and auto-saves to DB
2. **POST /api/save-report** - Manually save a report
3. **GET /api/get-reports?email=user@example.com** - Get user's reports

## Features

✅ Automatic report saving after AI analysis
✅ Query reports by user email
✅ Secure storage with Row Level Security
✅ Timestamped records
✅ File metadata tracking

## Troubleshooting

**Error: "Failed to save to database"**
- Check if your Supabase URL is correct in `.env.local`
- Verify the service role key is correct
- Make sure you ran the SQL schema
- Check Supabase Dashboard → Logs for errors

**Reports not showing up**
- Go to Supabase Dashboard → Table Editor → health_reports
- Check if records are being inserted
- Verify RLS policies are set correctly
