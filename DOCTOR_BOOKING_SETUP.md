# Doctor Booking System Setup

## Database Setup

### 1. Create Supabase Table

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create doctor_bookings table
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
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  amount INTEGER NOT NULL DEFAULT 199,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_booking_id ON doctor_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_user_id ON doctor_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_status ON doctor_bookings(status);

-- Enable Row Level Security
ALTER TABLE doctor_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own bookings" ON doctor_bookings
  FOR SELECT
  USING (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can create bookings" ON doctor_bookings
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own bookings" ON doctor_bookings
  FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_doctor_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_doctor_bookings_updated_at
  BEFORE UPDATE ON doctor_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_doctor_bookings_updated_at();
```

### 2. Verify Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Features Implemented

### ✅ Backend Integration
- **Supabase Database**: All bookings saved to `doctor_bookings` table
- **API Endpoints**:
  - `POST /api/book-doctor` - Create new booking
  - `GET /api/book-doctor` - Fetch user's bookings
- **Data Persistence**: Bookings survive page refresh

### ✅ Booking Flow
1. User fills booking form
2. Unique Booking ID generated (e.g., `DOC-1728134567-ABC123XYZ`)
3. Data saved to Supabase
4. Receipt modal shown with:
   - Booking details
   - WhatsApp integration
   - Download receipt option
5. Active booking banner shown on page

### ✅ WhatsApp Integration
- Pre-filled WhatsApp message with Booking ID
- Direct link to open WhatsApp chat
- Doctor contacts via WhatsApp video call
- 3-day follow-up via WhatsApp chatbot

### ✅ Status Tracking
- **Booking Status**: pending, confirmed, completed, cancelled
- **Payment Status**: pending, paid, refunded
- Visual status badges (color-coded)
- Active booking banner at top of page

## How to Test

1. **Create Supabase Table**: Run the SQL above in Supabase
2. **Restart Dev Server**: `npm run dev`
3. **Book a Consultation**:
   - Go to `/call-doctor`
   - Click "Book Consultation" on Real Doctor card
   - Fill the form and submit
4. **Verify**:
   - Check Supabase dashboard for new record
   - See active booking banner
   - Download receipt
   - Open WhatsApp chat

## Database Schema

```typescript
interface DoctorBooking {
  id: string                    // UUID
  booking_id: string            // DOC-{timestamp}-{random}
  user_id?: string              // Clerk user ID
  name: string                  // Patient name
  phone: string                 // Phone number
  email: string                 // Email
  concern: string               // Health concern
  preferred_time: string        // ISO timestamp
  booking_time: string          // ISO timestamp
  status: string                // pending/confirmed/completed/cancelled
  payment_status: string        // pending/paid/refunded
  amount: number                // 199
  whatsapp_number: string       // WhatsApp number
  created_at: string            // Auto-generated
  updated_at: string            // Auto-updated
}
```

## Next Steps

1. ✅ Database table created
2. ✅ API endpoints working
3. ✅ Frontend connected to backend
4. 🔄 Add payment integration (Razorpay/Stripe)
5. 🔄 Add WhatsApp API integration for automated messages
6. 🔄 Add admin dashboard to manage bookings
