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

-- Create index on booking_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_booking_id ON doctor_bookings(booking_id);

-- Create index on user_id for faster user queries
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_user_id ON doctor_bookings(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_doctor_bookings_status ON doctor_bookings(status);

-- Enable Row Level Security
ALTER TABLE doctor_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own bookings
CREATE POLICY "Users can view own bookings" ON doctor_bookings
  FOR SELECT
  USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Create policy to allow users to insert their own bookings
CREATE POLICY "Users can create bookings" ON doctor_bookings
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

-- Create policy to allow users to update their own bookings
CREATE POLICY "Users can update own bookings" ON doctor_bookings
  FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_doctor_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_doctor_bookings_updated_at
  BEFORE UPDATE ON doctor_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_doctor_bookings_updated_at();
