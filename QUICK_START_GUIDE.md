# 🚀 Quick Start Guide - Health Vault

## ⚠️ IMPORTANT: Setup Supabase First!

Your Supabase URL is still a placeholder. You MUST update it for Health Vault to work.

### Step 1: Get Your Supabase Project URL

1. Go to https://supabase.com/dashboard
2. Sign in or create account
3. Create a new project (or select existing)
4. Go to **Settings** → **API**
5. Copy your **Project URL** (e.g., `https://abcdefgh.supabase.co`)

### Step 2: Update `.env.local`

Replace this line:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

With your actual URL:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-id.supabase.co
```

### Step 3: Run SQL Schema (Already Done ✅)

You mentioned you already ran the schema in SQL Editor. Great!

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

## 📝 How to Use Health Vault

### Uploading Reports (Automatic Save):

1. **Go to Home Page** (click "Tabeer AI" logo or go to `/`)
2. **Upload a health report**:
   - Drag & drop OR click "Browse Files"
   - Supported: PDF, JPG, PNG (max 10MB)
3. **Click "Analyze Report"**
4. **Modal appears**: "Whose report is this?"
   - Select relationship (Self, Father, Mother, etc.)
   - Optionally enter name
   - Click "Continue"
5. **AI analyzes** the report (takes 10-30 seconds)
6. **Automatically saved** to Health Vault! ✅

### Viewing Reports in Dashboard:

1. **Go to Dashboard** (`/dashboard`)
2. **See your reports** in the table:
   - Report name
   - Family member (color badge)
   - Date uploaded
   - Status (Analyzed ✅)
3. **Filter by family member**:
   - Use dropdown at top-right
   - Select "All" or specific family member
4. **Click "Health Vault"** in sidebar to jump to reports section

### Health Vault Shows:

- **Total reports** count
- **Family members** count
- **Storage used** (MB)
- **Breakdown** by family member
- **All reports** in organized table

## 🔍 Troubleshooting

### Reports not showing up?

**Check 1: Supabase URL**
```bash
cat .env.local | grep SUPABASE_URL
```
Should show your actual project URL, not placeholder.

**Check 2: Browser Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors when uploading

**Check 3: Supabase Dashboard**
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `health_reports` table
4. Check if data is being inserted

**Check 4: Network Tab**
1. Open DevTools → Network tab
2. Upload a report
3. Look for `/api/analyze-report` request
4. Check if it returns 200 OK
5. Look for `/api/get-reports` request in Dashboard

### Common Issues:

**"No reports uploaded yet"**
- You haven't uploaded any reports yet
- Go to home page (/) and upload one

**"Failed to analyze report"**
- Check Gemini API key in `.env.local`
- Check browser console for errors

**Reports uploaded but not in Dashboard**
- Supabase URL might be wrong
- Check browser console for API errors
- Verify you're signed in with same account

## ✅ Test Checklist

- [ ] Updated Supabase URL in `.env.local`
- [ ] Ran SQL schema in Supabase
- [ ] Restarted dev server
- [ ] Signed in to app
- [ ] Uploaded a test report from home page
- [ ] Selected family member in modal
- [ ] Report analyzed successfully
- [ ] Went to Dashboard
- [ ] See report in table
- [ ] Can filter by family member
- [ ] Health Vault shows statistics

## 🎯 Quick Demo Flow

```
1. Home (/) → Upload report
2. Select "Father" → Enter "John"
3. Wait for analysis
4. Go to Dashboard
5. See "John" in Family Member column
6. Filter by "John" to see only his reports
7. Health Vault shows: 1 report, 1 family member
```

## 📞 Need Help?

If reports still not showing:
1. Share your browser console errors
2. Check Supabase logs
3. Verify all environment variables are set
4. Make sure you're signed in

**The system is fully built and ready - you just need to configure Supabase URL!** 🚀
