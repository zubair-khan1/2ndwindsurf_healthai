import { generateText } from "ai"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64 for AI processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    const { text } = await generateText({
      model: "xai/grok-beta",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a medical expert AI assistant. Analyze this lab report and provide a detailed, patient-friendly explanation. 

Structure your response in the following format:

## Report Summary
[Brief overview of what tests were conducted]

## Key Findings
[List the main test results with normal ranges]

## What This Means
[Explain in simple terms what these results indicate about the patient's health]

## Recommendations
[Suggest next steps or lifestyle changes if applicable]

## Important Notes
[Any critical values or concerns that need immediate attention]

Make it conversational, empathetic, and easy to understand for someone without medical background.`,
            },
            {
              type: "file",
              data: base64,
              mediaType: file.type || "application/pdf",
              filename: file.name,
            },
          ],
        },
      ],
      maxOutputTokens: 2000,
      temperature: 0.7,
    })

    return Response.json({
      analysis: text,
      fileName: file.name,
      fileSize: file.size,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error analyzing report:", error)
    return Response.json({ error: "Failed to analyze report" }, { status: 500 })
  }
}
