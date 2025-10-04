import { generateText } from "ai"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { analysis, language = "English" } = await req.json()

    if (!analysis) {
      return Response.json({ error: "No analysis provided" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "xai/grok-beta",
      prompt: `Convert this medical report analysis into a friendly, conversational video script in ${language}. 

The script should:
- Be spoken in a warm, reassuring tone
- Use simple language that anyone can understand
- Be structured in short, clear segments (30-45 seconds each)
- Include natural pauses and transitions
- Be culturally appropriate for ${language} speakers
- Total duration: 2-3 minutes

Analysis to convert:
${analysis}

Format the script with timestamps like:
[00:00-00:30] Introduction segment
[00:30-01:00] Key findings segment
etc.`,
      maxOutputTokens: 2000,
      temperature: 0.8,
    })

    return Response.json({
      script: text,
      language,
      estimatedDuration: "2-3 minutes",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error generating video script:", error)
    return Response.json({ error: "Failed to generate video script" }, { status: 500 })
  }
}
