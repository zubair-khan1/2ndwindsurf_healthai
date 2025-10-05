# Clerk Authentication Setup Guide

## ✅ What's Already Done

1. ✅ Installed `@clerk/nextjs`
2. ✅ Created `middleware.ts` with `clerkMiddleware()`
3. ✅ Wrapped app with `<ClerkProvider>` in `app/layout.tsx`
4. ✅ Integrated Clerk user ID with Supabase database

## 🔑 Get Your Clerk API Keys

### Step 1: Create a Clerk Account
1. Go to https://clerk.com/
2. Sign up or log in
3. Create a new application

### Step 2: Get Your API Keys
1. In your Clerk Dashboard, go to **API Keys** (left sidebar)
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### Step 3: Add Keys to `.env.local`

Open `.env.local` and replace the placeholder values:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
```

**IMPORTANT:** Replace `YOUR_PUBLISHABLE_KEY` and `YOUR_SECRET_KEY` with your actual keys from Clerk Dashboard.

## 🚀 How It Works

### Authentication Flow:
1. **User uploads a health report** → Clerk provides `userId`
2. **AI analyzes the report** → Gemini generates analysis
3. **Report is saved to Supabase** → Linked to user's Clerk `userId`
4. **User can view their reports** → Query by `userId`

### Files Modified:
- ✅ `middleware.ts` - Clerk authentication middleware
- ✅ `app/layout.tsx` - Wrapped with `<ClerkProvider>`
- ✅ `app/api/analyze-report/route.ts` - Gets `userId` from Clerk
- ✅ `supabase-schema.sql` - Updated to use `user_id` instead of `user_email`

## 🎨 Add Sign In/Sign Up UI (Optional)

You can add Clerk's pre-built components to your navigation. Update your header component:

```tsx
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function Header() {
  return (
    <header>
      <SignedOut>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  )
}
```

## 🔒 Protect Routes (Optional)

To make certain pages require authentication, update `middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/reports(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
```

## 🧪 Test the Integration

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Upload a health report** - The report will be saved with your Clerk `userId`

3. **Check Supabase Dashboard:**
   - Go to Table Editor → `health_reports`
   - You should see `user_id` populated with Clerk user IDs

## 📊 Query User's Reports

Use the `/api/get-reports` endpoint:

```typescript
// Get current user's reports
const { userId } = await auth()
const response = await fetch(`/api/get-reports?userId=${userId}`)
const { reports } = await response.json()
```

## 🔐 Security Features

✅ **Automatic user authentication** - Clerk handles sessions
✅ **Secure API routes** - User ID from authenticated session
✅ **Row Level Security** - Supabase policies protect user data
✅ **No manual password management** - Clerk handles everything

## 📚 Clerk Features You Can Use

- **Social Login** (Google, GitHub, etc.)
- **Multi-factor Authentication**
- **Email verification**
- **User profiles**
- **Organizations/Teams**
- **Webhooks** for user events

## 🆘 Troubleshooting

**Error: "Clerk: Missing publishable key"**
- Make sure you added your keys to `.env.local`
- Restart the dev server after adding keys

**Reports not saving with user_id**
- Check that Clerk middleware is working
- Verify `userId` is not null in API logs
- Make sure you ran the updated Supabase schema

**Can't sign in**
- Check Clerk Dashboard → Settings → Allowed domains
- Make sure `localhost:3000` is allowed for development

## 🎉 You're All Set!

Your app now has:
- ✅ User authentication with Clerk
- ✅ Secure report storage in Supabase
- ✅ User-specific report tracking
- ✅ Ready for production deployment
