import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

const HEYGEN_API_KEY = "ZGIyZDZkYzMzOWYxNGVjZDk0MTgxNTBhMWM3MWU0OTktMTc1OTYyMTcyMw=="

export async function POST(req: Request) {
  const { userId } = await auth()

  try {
    const { analysis } = await req.json()

    if (!analysis) {
      return NextResponse.json({ error: "No analysis provided" }, { status: 400 })
    }

    console.log("Generating short video script for HeyGen...")

    // Step 1: Generate a SHORT script using Gemini
    const prompt = `Based on this health report analysis, create a VERY SHORT video script (maximum 150 words) that includes:
1. Patient name or "the patient"
2. Main health problem/concern (1-2 sentences)
3. Key solution/recommendation (1-2 sentences)

Keep it conversational, friendly, and under 150 words total.

Analysis:
${analysis}

Format: Just the script text, no labels or formatting.`

    const { text: shortScript } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: prompt,
      temperature: 0.7,
    })

    console.log("✅ Short script generated successfully!")
    console.log("Script length:", shortScript.length, "characters")
    console.log("Script preview:", shortScript.substring(0, 150) + "...")

    // Step 2: Send to HeyGen API
    console.log("\n🎬 Preparing HeyGen API request...")
    
    const heygenPayload = {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: "Nadim",
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            input_text: shortScript,
            voice_id: "119caed25533477ba63822d5d1552d25",
            speed: 1.1,
          },
        },
      ],
      dimension: {
        width: 1280,
        height: 720,
      },
    }
    
    console.log("HeyGen Request Payload:", JSON.stringify(heygenPayload, null, 2))
    console.log("HeyGen API Key (first 20 chars):", HEYGEN_API_KEY.substring(0, 20) + "...")
    console.log("HeyGen API Endpoint:", "https://api.heygen.com/v2/video/generate")

    const heygenResponse = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(heygenPayload),
    })
    
    console.log("\n📡 HeyGen API Response Status:", heygenResponse.status, heygenResponse.statusText)

    const heygenData = await heygenResponse.json()
    console.log("HeyGen full response:", JSON.stringify(heygenData, null, 2))

    if (!heygenResponse.ok) {
      console.error("HeyGen API error:", heygenData)
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to generate video", 
          details: heygenData,
          message: heygenData.message || "HeyGen API error"
        },
        { status: heygenResponse.status }
      )
    }

    // Check if we got a video_id
    const videoId = heygenData.data?.video_id || heygenData.video_id
    
    if (!videoId) {
      console.error("No video ID in response:", heygenData)
      return NextResponse.json({
        success: false,
        error: "No video ID received from HeyGen",
        details: heygenData,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      videoId: videoId,
      script: shortScript,
      status: "processing",
      message: "Video is being generated. This may take a few minutes.",
    })
  } catch (error) {
    console.error("Error generating HeyGen video:", error)
    return NextResponse.json(
      { error: "Failed to generate video", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
