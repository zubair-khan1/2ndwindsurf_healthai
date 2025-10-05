import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { script, language = "english" } = await req.json()

    console.log("AI Doctor Call Request:", { script, language })

    if (!script) {
      return NextResponse.json(
        { error: "Script is required" },
        { status: 400 }
      )
    }

    const requestBody = {
      language: language,
      aspect_ratio: 0,
      video_length: "15",
      avatar_id: 1422,
      avatar_type: 0,
      script: script,
      script_style: "Problem/Solution",
      template_type: "public",
      voice_id: "tb_f933422a22374ec6b7e55028acd69a64",
      caption: true,
      visual_style: 188,
    }

    console.log("Sending to Jogg.ai:", requestBody)

    // Call Jogg.ai API
    const response = await fetch("https://api.jogg.ai/v1/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "7f98ded5895c41d9b9089fdb9130f51b",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Jogg.ai response status:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Jogg.ai API error:", errorData)
      return NextResponse.json(
        { 
          error: "Failed to generate AI doctor call",
          details: errorData,
          status: response.status 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Jogg.ai response data:", data)
    
    // Return the data with preview_url or video_url
    return NextResponse.json({
      success: true,
      preview_url: data.preview_url || data.video_url || data.url,
      video_url: data.video_url || data.preview_url || data.url,
      data: data
    })
  } catch (error) {
    console.error("Error in AI doctor call:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
