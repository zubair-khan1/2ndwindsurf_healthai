import { NextResponse } from "next/server"

const HEYGEN_API_KEY = "ZGIyZDZkYzMzOWYxNGVjZDk0MTgxNTBhMWM3MWU0OTktMTc1OTYyMTcyMw=="

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json()

    if (!videoId) {
      return NextResponse.json({ error: "No video ID provided" }, { status: 400 })
    }

    console.log("🔍 Checking video status for ID:", videoId)

    const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
      method: "GET",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
      },
    })

    console.log("📡 Status check response:", response.status, response.statusText)

    const data = await response.json()
    console.log("Status data:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error("❌ Status check failed:", data)
      return NextResponse.json({ error: "Failed to check video status", details: data }, { status: response.status })
    }

    const videoStatus = data.data?.status
    const videoUrl = data.data?.video_url
    
    console.log("Video status:", videoStatus)
    console.log("Video URL:", videoUrl || "Not ready yet")

    return NextResponse.json({
      status: videoStatus,
      videoUrl: videoUrl,
      thumbnailUrl: data.data?.thumbnail_url,
    })
  } catch (error) {
    console.error("Error checking video status:", error)
    return NextResponse.json(
      { error: "Failed to check video status", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
