# 🔧 Supabase Connection Fix

## ✅ What I Fixed:

1. **Corrected Supabase URL** from dashboard URL to API URL:
   - ❌ Wrong: `https://supabase.com/dashboard/project/amzzcumohiuokowqvhgz`
   - ✅ Correct: `https://amzzcumohiuokowqvhgz.supabase.co`

2. **Added detailed logging** to see exactly what's happening when saving

## 🔑 CRITICAL: Get Your Service Role Key

Your current service role key looks incomplete. You need the FULL key.

### Steps to Get Correct Key:

1. **Go to Supabase API Settings:**
   ```
   https://supabase.com/dashboard/project/amzzcumohiuokowqvhgz/settings/api
   ```

2. **Find "service_role" key** (NOT "anon" key)
   - It's a LONG key starting with `eyJ...`
   - Should be 200+ characters
   - Click the eye icon to reveal it
   - Click copy button

3. **Update `.env.local`:**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtenp...
   ```
   (Replace with your FULL key)

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

## 🧪 Test the Connection

### Method 1: Upload a Report
1. Go to http://localhost:3000
2. Upload a health report
3. Check your terminal for logs:
   ```
   🔄 Attempting to save to Supabase...
   Supabase URL: https://amzzcumohiuokowqvhgz.supabase.co
   Has Service Key: true
   User ID: user_xxx
   📝 Inserting report data: ...
   ✅ Report saved to Health Vault with ID: xxx
   ```

### Method 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Upload a report
4. Look for any errors

### Method 3: Check Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/amzzcumohiuokowqvhgz/editor
2. Click **Table Editor**
3. Select `health_reports` table
4. After uploading, refresh to see if data appears

## 🔍 Debugging Checklist

### If data still not saving:

**1. Check Environment Variables:**
```bash
cat .env.local
```
Should show:
- ✅ `NEXT_PUBLIC_SUPABASE_URL=https://amzzcumohiuokowqvhgz.supabase.co`
- ✅ `SUPABASE_SERVICE_ROLE_KEY=eyJ...` (long key)
- ✅ `GOOGLE_GENERATIVE_AI_API_KEY=AIza...`
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`
- ✅ `CLERK_SECRET_KEY=sk_test_...`

**2. Check Terminal Logs:**
Look for these messages after uploading:
```
Processing file: report.pdf Size: 450000 Type: application/pdf
AI Response received, length: 2500
🔄 Attempting to save to Supabase...
Supabase URL: https://amzzcumohiuokowqvhgz.supabase.co
Has Service Key: true
✅ Report saved to Health Vault with ID: xxx
```

**3. Check for Errors:**
If you see:
- ❌ `Has Service Key: false` → Key is missing or wrong
- ❌ `Failed to save to Health Vault` → Check error details
- ❌ `Invalid API key` → Service role key is wrong

**4. Verify Table Structure:**
In Supabase, check `health_reports` table has these columns:
- `id` (uuid)
- `user_id` (text)
- `file_name` (text)
- `file_size` (bigint)
- `file_type` (text)
- `analysis` (text)
- `family_member_name` (text)
- `relationship` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**5. Check RLS Policies:**
In Supabase → Authentication → Policies:
- Should have policy: "Anyone can insert reports"
- Should have policy: "Users can view their own reports"

## 🎯 Current Status

Your setup:
- ✅ Supabase URL: Fixed
- ⚠️ Service Role Key: Needs verification (might be incomplete)
- ✅ Table structure: Created
- ✅ Code: Updated with logging
- ✅ API routes: Configured

## 📝 Next Steps:

1. **Get your FULL service role key** from Supabase
2. **Update `.env.local`** with the complete key
3. **Restart dev server**
4. **Upload a test report**
5. **Check terminal logs** for success message
6. **Verify in Supabase** table editor

## 🆘 Still Not Working?

Share these with me:
1. Terminal logs after uploading
2. Browser console errors
3. Screenshot of Supabase API keys page (hide the keys)
4. Confirm you ran the SQL schema

The connection is configured correctly - you just need the right service role key! 🔑
