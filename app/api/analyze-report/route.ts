import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"

export const maxDuration = 60

export async function POST(req: Request) {
  const { userId } = await auth()
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const familyMemberName = formData.get("familyMemberName") as string
    const relationship = formData.get("relationship") as string

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("Missing API key. Please set GOOGLE_GENERATIVE_AI_API_KEY in .env.local")
      return Response.json(
        {
          error:
            "AI service not configured. Please add your GOOGLE_GENERATIVE_AI_API_KEY to .env.local file. Get one from https://aistudio.google.com/app/apikey",
        },
        { status: 503 }
      )
    }

    // Convert file to base64 for AI processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    console.log("Processing file:", file.name, "Size:", file.size, "Type:", file.type)

    // Step 1: Validate if the document is a health/medical report (can be disabled for testing)
    const skipValidation = process.env.SKIP_HEALTH_VALIDATION === "true"
    
    if (skipValidation) {
      console.log("⚠️ Health validation is disabled (SKIP_HEALTH_VALIDATION=true)")
    } else {
      console.log("🔍 Validating if document is a health report...")
      const { text: validationResult } = await generateText({
        model: google("gemini-2.5-flash"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a medical document classifier. Carefully analyze this document and determine if it contains ANY health or medical information.

A VALID health/medical document includes ANY of these:
- Lab test results (blood tests, CBC, lipid profile, liver function, kidney function, urine tests, etc.)
- Medical test values and parameters (hemoglobin, glucose, cholesterol, etc.)
- Medical imaging reports (X-ray, MRI, CT scan, ultrasound, etc.)
- Pathology reports or biopsy results
- Diagnostic reports from hospitals or clinics
- Health checkup reports or wellness reports
- Medical prescriptions with test results
- Hospital discharge summaries
- Any document with medical test names, values, or reference ranges

An INVALID document is:
- A blank page or unreadable document
- A financial invoice or receipt (without medical tests)
- A general business document
- A personal letter or form (without medical content)
- Random text or images

IMPORTANT: If you see ANY medical test names, values, or health-related measurements, respond VALID.
Be LENIENT - when in doubt about medical content, respond VALID.

Respond with ONLY ONE WORD:
- "VALID" if this contains ANY health/medical information
- "INVALID" if this is clearly NOT a medical document

Response:`,
              },
              {
                type: "image",
                image: `data:${file.type || "application/pdf"};base64,${base64}`,
              },
            ],
          },
        ],
        maxOutputTokens: 10,
        temperature: 0.1,
      })

      const isValid = validationResult.trim().toUpperCase().includes("VALID")
      console.log("📋 Validation result:", validationResult.trim(), "- Is valid:", isValid)

      if (!isValid) {
        console.log("❌ Document is not a health report")
        return Response.json(
          {
            error: "This doesn't appear to be a health or medical report. Please upload a lab test report, medical imaging report, or other health-related document.",
          },
          { status: 400 }
        )
      }

      console.log("✅ Document validated as health report, proceeding with analysis...")
    }

    // Step 2: Analyze the health report
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert medical AI assistant specializing in making lab reports easy to understand. Analyze this lab report in extreme detail and create a comprehensive, patient-friendly explanation.

**IMPORTANT INSTRUCTIONS:**
1. Analyze EVERY test result shown in the report
2. For EACH test, explain:
   - What the test measures (in simple terms)
   - The patient's value
   - The normal/reference range
   - Whether it's HIGH ⬆️, LOW ⬇️, or NORMAL ✅
   - What this means for their health
   - Why this matters

3. Use emojis and icons to make it engaging:
   - ✅ for normal values
   - ⬆️ for high values (use 🔴 if critically high)
   - ⬇️ for low values (use 🔴 if critically low)
   - ⚠️ for values that need attention
   - 💡 for helpful tips
   - 🏥 for when to see a doctor
   - 💊 for medication-related info
   - 🥗 for diet recommendations
   - 🏃 for exercise suggestions

4. Structure your response EXACTLY like this:

## 📋 Report Overview
[Brief summary of what type of tests were done and when]

## 🔬 Detailed Test Results

### [Test Category Name] (e.g., Complete Blood Count)

#### Test Name 1
- **Your Value:** [value] [unit]
- **Normal Range:** [range]
- **Status:** [✅ Normal / ⬆️ High / ⬇️ Low]
- **What it measures:** [Simple explanation of what this test checks]
- **What your result means:** [Detailed explanation of what this specific value indicates about their health]
- **Why it matters:** [Why this is important for overall health]

[Repeat for EVERY test in the report]

## 📊 Summary of Concerns

### 🔴 Critical Issues (Immediate Attention Needed)
[List any critically abnormal values]

### ⚠️ Values to Monitor
[List moderately abnormal values]

### ✅ Normal Values
[Briefly mention what's in good range]

## 💡 What This Means for You

[Comprehensive explanation in simple, conversational language about:
- Overall health picture
- What the abnormal values mean together
- How different results relate to each other
- Potential health implications]

## 🎯 Recommendations

### 🏥 Medical Actions
- [Specific recommendations about seeing doctors, specialists, or follow-up tests]

### 🥗 Diet & Lifestyle
- [Specific dietary changes]
- [Lifestyle modifications]
- [Foods to eat more/less of]

### 💊 Questions to Ask Your Doctor
- [List of specific questions they should ask based on their results]

## ⚠️ Important Reminders
- This is an AI analysis for educational purposes
- Always consult with your healthcare provider
- Don't make medical decisions based solely on this analysis
- Bring this report to your next doctor's visit

Make it warm, empathetic, encouraging, and EXTREMELY detailed. Use simple language but be thorough. Don't skip any test results!`,
            },
            {
              type: "image",
              image: `data:${file.type || "application/pdf"};base64,${base64}`,
            },
          ],
        },
      ],
      maxOutputTokens: 4000,
      temperature: 0.7,
    })

    console.log("AI Response received, length:", text?.length || 0)
    console.log("AI Response preview:", text?.substring(0, 200))

    // Save to Supabase (Health Vault)
    console.log("🔄 Attempting to save to Supabase...")
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Has Service Key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log("User ID:", userId)
    console.log("Family Member:", familyMemberName, "Relationship:", relationship)
    
    try {
      const displayName = familyMemberName || relationship || "Self"
      const reportData = {
        user_id: userId || null,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        analysis: text || "No analysis generated",
        family_member_name: displayName,
        relationship: relationship || "Self",
      }
      
      console.log("📝 Inserting report data:", {
        ...reportData,
        analysis: `${reportData.analysis.substring(0, 50)}...`
      })
      
      const { data: savedReport, error: dbError} = await supabase
        .from("health_reports")
        .insert(reportData)
        .select()
        .single()

      if (dbError) {
        console.error("❌ Failed to save to Health Vault:", dbError)
        console.error("Error details:", JSON.stringify(dbError, null, 2))
      } else {
        console.log("✅ Report saved to Health Vault with ID:", savedReport.id, "for", displayName)
        console.log("Saved report:", savedReport)
      }
    } catch (dbError) {
      console.error("❌ Database error:", dbError)
      console.error("Error stack:", dbError instanceof Error ? dbError.stack : 'No stack trace')
      // Continue even if database save fails
    }

    return Response.json({
      analysis: text || "No analysis generated",
      fileName: file.name,
      fileSize: file.size,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error analyzing report:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json(
      {
        error: `Failed to analyze report: ${errorMessage}. Please check your API key configuration.`,
      },
      { status: 500 }
    )
  }
}
