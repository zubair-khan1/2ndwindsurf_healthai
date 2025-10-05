import { NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  try {
    const { message, analysis, conversationHistory } = await req.json()

    if (!message || !analysis) {
      return NextResponse.json(
        { error: "Message and analysis are required" },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("Missing API key. Please set GOOGLE_GENERATIVE_AI_API_KEY in .env.local")
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      )
    }

    // Build conversation context
    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = "\n\nPrevious conversation:\n"
      conversationHistory.forEach((msg: any) => {
        conversationContext += `${msg.role === "user" ? "Patient" : "Assistant"}: ${msg.content}\n`
      })
    }

    const systemPrompt = `You are a helpful medical AI assistant analyzing a patient's health report. Here is the complete report analysis:

${analysis}

Your role is to:
1. Answer questions about the report in simple, easy-to-understand language
2. Provide personalized health recommendations based on the results
3. Suggest diet plans, lifestyle changes, and preventive measures
4. Explain medical terms and test results clearly
5. Be empathetic and supportive

Always base your answers on the report provided. If asked about something not in the report, politely explain that you can only discuss what's in the current report.${conversationContext}

Patient's question: ${message}

Please provide a helpful, clear, and empathetic response:`

    // Call Gemini API
    const { text: response } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: systemPrompt,
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat-with-report:", error)
    return NextResponse.json(
      { error: "Failed to process chat message", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
