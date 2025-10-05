# Admin Dashboard Setup Instructions

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Database Table

Go to your **Supabase Dashboard** → **SQL Editor** and run this:

```sql
CREATE TABLE IF NOT EXISTS doctor_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  user_id TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  concern TEXT NOT NULL,
  preferred_time TIMESTAMPTZ NOT NULL,
  booking_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  amount INTEGER DEFAULT 199,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_booking_id ON doctor_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_user_id ON doctor_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_status ON doctor_bookings(status);
```

### Step 2: Verify Environment Variables

Make sure your `.env.local` has:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk (for admin verification)
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Step 3: Test the Admin Dashboard

1. **Sign in** with `khnnabubakar786@gmail.com`
2. **Navigate** to `/admin` (link appears in navbar for you only)
3. **View** all data:
   - Total users, reports, bookings, revenue
   - User details with activity
   - All health reports
   - All doctor bookings

## 📊 Admin Dashboard Features

### **Overview Tab**
- Total users count
- Total reports submitted
- Total bookings made
- Total revenue generated
- Pending vs completed bookings
- Recent bookings list
- Recent reports list

### **Users Tab**
- All registered users
- User email and name
- Number of reports per user
- Number of bookings per user
- Join date and last sign-in
- Export to CSV button

### **Reports Tab**
- All health reports submitted
- File names and sizes
- Family member info
- Upload dates
- User IDs
- Export functionality

### **Bookings Tab**
- All doctor bookings
- Booking IDs (unique)
- Patient details (name, phone, email)
- Health concerns
- Booking status (pending/confirmed/completed/cancelled)
- Payment status (pending/paid/refunded)
- Amount (₹199)
- WhatsApp numbers
- Scheduled times
- Export functionality

## 🔒 Security

- **Email-based access control**: Only `khnnabubakar786@gmail.com` can access
- **Frontend check**: Redirects unauthorized users to home
- **Backend verification**: All API endpoints verify admin email
- **Clerk integration**: Uses Clerk API to verify user identity
- **Admin link visibility**: "Admin" nav link only shows for your email

## 📱 Admin Access

The admin dashboard is accessible at:
- **URL**: `https://yourdomain.com/admin`
- **Navbar**: "Admin" link (only visible to you)
- **Direct access**: Type `/admin` in browser

## ✅ What's Connected to Backend

All data is **real and live** from Supabase:

1. **Users**: Fetched from Clerk API + Supabase activity
2. **Reports**: From `health_reports` table
3. **Bookings**: From `doctor_bookings` table
4. **Stats**: Calculated from real database data
5. **Revenue**: Sum of all booking amounts

## 🎯 Next Steps

After creating the table:
1. Restart dev server: `npm run dev`
2. Sign in with `khnnabubakar786@gmail.com`
3. Click "Admin" in navbar
4. View all real-time data!

## 📝 Notes

- All data updates in real-time
- No mock data - everything is from database
- Export buttons ready for CSV export (can be implemented)
- Status badges are color-coded for easy scanning
- Responsive design works on all devices
