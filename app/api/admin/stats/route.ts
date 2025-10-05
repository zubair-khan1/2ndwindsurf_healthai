import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

const ADMIN_EMAIL = "khnnabubakar786@gmail.com"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user email from Clerk
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json())

    const userEmail = user.email_addresses?.[0]?.email_address

    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch stats from Supabase
    const [reportsResult, bookingsResult] = await Promise.all([
      supabase.from("health_reports").select("*", { count: "exact" }),
      supabase.from("doctor_bookings").select("*", { count: "exact" }),
    ])

    const totalReports = reportsResult.count || 0
    const totalBookings = bookingsResult.count || 0

    // Get unique users from reports
    const uniqueUserIds = new Set(
      reportsResult.data?.map((r) => r.user_id).filter(Boolean) || []
    )
    const totalUsers = uniqueUserIds.size

    // Calculate revenue and booking stats
    const bookings = bookingsResult.data || []
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
    const pendingBookings = bookings.filter((b) => b.status === "pending").length
    const completedBookings = bookings.filter((b) => b.status === "completed").length

    const stats = {
      totalUsers,
      totalReports,
      totalBookings,
      totalRevenue,
      pendingBookings,
      completedBookings,
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
