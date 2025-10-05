import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const { name, phone, email, concern, preferredTime } = await req.json()

    if (!name || !phone || !email || !concern || !preferredTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Generate unique booking ID
    const bookingId = `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Create booking timestamp
    const bookingTime = new Date().toISOString()
    const consultationTime = new Date(preferredTime).toISOString()

    // Create booking object for database
    const bookingData = {
      booking_id: bookingId,
      user_id: userId || null,
      name,
      phone,
      email,
      concern,
      preferred_time: consultationTime,
      booking_time: bookingTime,
      status: "pending",
      payment_status: "pending",
      amount: 199,
      whatsapp_number: phone,
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from("doctor_bookings")
      .insert([bookingData])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to save booking to database" },
        { status: 500 }
      )
    }

    // Return booking in frontend format
    const booking = {
      bookingId: data.booking_id,
      userId: data.user_id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      concern: data.concern,
      preferredTime: data.preferred_time,
      bookingTime: data.booking_time,
      status: data.status,
      paymentStatus: data.payment_status,
      amount: data.amount,
      whatsappNumber: data.whatsapp_number,
    }
    
    return NextResponse.json({
      success: true,
      booking,
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch user's bookings
export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("doctor_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      )
    }

    // Convert to frontend format
    const bookings = data.map((booking) => ({
      bookingId: booking.booking_id,
      userId: booking.user_id,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      concern: booking.concern,
      preferredTime: booking.preferred_time,
      bookingTime: booking.booking_time,
      status: booking.status,
      paymentStatus: booking.payment_status,
      amount: booking.amount,
      whatsappNumber: booking.whatsapp_number,
    }))

    return NextResponse.json({
      success: true,
      bookings,
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
