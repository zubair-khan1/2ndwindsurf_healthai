import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userEmail, fileName, fileSize, fileType, analysis } = await req.json()

    if (!fileName || !fileSize || !fileType || !analysis) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert report into database
    const { data, error } = await supabase
      .from("health_reports")
      .insert({
        user_email: userEmail || null,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        analysis: analysis,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 })
    }

    return NextResponse.json({ success: true, reportId: data.id })
  } catch (error) {
    console.error("Error saving report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
