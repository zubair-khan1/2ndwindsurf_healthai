import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Database types
export interface HealthReport {
  id: string
  user_id?: string
  file_name: string
  file_size: number
  file_type: string
  file_url?: string
  analysis: string
  family_member_name: string
  relationship: string
  created_at: string
  updated_at: string
}

export interface DoctorBooking {
  id: string
  booking_id: string
  user_id?: string
  name: string
  phone: string
  email: string
  concern: string
  preferred_time: string
  booking_time: string
  status: string // pending, confirmed, completed, cancelled
  payment_status: string // pending, paid, refunded
  amount: number
  whatsapp_number: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  user_email: string
  user_name: string
  plan: string // basic, pro, enterprise
  amount: number
  transaction_id: string
  upi_id: string
  status: string // pending, approved, rejected
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}
