import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan, amount, transactionId, upiId } = await req.json()

    if (!plan || !amount || !transactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get user details from Clerk
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json())

    const userEmail = user.email_addresses?.[0]?.email_address || ""
    const userName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User"

    // Create subscription record
    const subscriptionData = {
      user_id: userId,
      user_email: userEmail,
      user_name: userName,
      plan,
      amount,
      transaction_id: transactionId,
      upi_id: upiId,
      status: "pending",
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .insert([subscriptionData])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to submit subscription" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data,
      message: "Subscription submitted for approval",
    })
  } catch (error) {
    console.error("Error submitting subscription:", error)
    return NextResponse.json(
      { error: "Failed to submit subscription" },
      { status: 500 }
    )
  }
}
