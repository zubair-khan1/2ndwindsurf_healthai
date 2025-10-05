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

    // Verify admin
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json())

    const userEmail = user.email_addresses?.[0]?.email_address

    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch all reports to get user activity
    const { data: reports } = await supabase
      .from("health_reports")
      .select("user_id, created_at")

    const { data: bookings } = await supabase
      .from("doctor_bookings")
      .select("user_id, created_at")

    // Aggregate user data
    const userMap = new Map()

    reports?.forEach((report) => {
      if (!report.user_id) return
      if (!userMap.has(report.user_id)) {
        userMap.set(report.user_id, {
          id: report.user_id,
          reportsCount: 0,
          bookingsCount: 0,
          createdAt: report.created_at,
        })
      }
      userMap.get(report.user_id).reportsCount++
    })

    bookings?.forEach((booking) => {
      if (!booking.user_id) return
      if (!userMap.has(booking.user_id)) {
        userMap.set(booking.user_id, {
          id: booking.user_id,
          reportsCount: 0,
          bookingsCount: 0,
          createdAt: booking.created_at,
        })
      }
      userMap.get(booking.user_id).bookingsCount++
    })

    // Fetch user details from Clerk
    const users = await Promise.all(
      Array.from(userMap.values()).map(async (userData) => {
        try {
          const clerkUser = await fetch(
            `https://api.clerk.com/v1/users/${userData.id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              },
            }
          ).then((res) => res.json())

          return {
            id: userData.id,
            email: clerkUser.email_addresses?.[0]?.email_address || "N/A",
            name:
              `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() ||
              "Anonymous",
            createdAt: clerkUser.created_at
              ? new Date(clerkUser.created_at).toISOString()
              : userData.createdAt,
            lastSignIn: clerkUser.last_sign_in_at
              ? new Date(clerkUser.last_sign_in_at).toISOString()
              : "N/A",
            reportsCount: userData.reportsCount,
            bookingsCount: userData.bookingsCount,
          }
        } catch (error) {
          return {
            id: userData.id,
            email: "N/A",
            name: "Anonymous",
            createdAt: userData.createdAt,
            lastSignIn: "N/A",
            reportsCount: userData.reportsCount,
            bookingsCount: userData.bookingsCount,
          }
        }
      })
    )

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
