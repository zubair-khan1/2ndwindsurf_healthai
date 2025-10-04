"use client"

import { useState } from "react"
import { FileText, Video, Download, Share2, Loader2, Languages } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ReportAnalysisProps {
  analysis: string
  fileName: string
  fileSize: number
  onBack: () => void
}

export function ReportAnalysis({ analysis, fileName, fileSize, onBack }: ReportAnalysisProps) {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoScript, setVideoScript] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const languages = ["English", "Hindi", "Spanish", "Arabic", "Bengali", "Portuguese", "Urdu", "Tamil", "Telugu"]

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true)
    try {
      const response = await fetch("/api/generate-video-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, language: selectedLanguage }),
      })

      const data = await response.json()
      setVideoScript(data.script)
    } catch (error) {
      console.error("[v0] Error generating video script:", error)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F8F6F4] to-[#EDE9E6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button onClick={onBack} className="text-[#605A57] hover:text-[#37322F] font-medium transition-colors">
            ← Back to Upload
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/60 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-[#605A57]" />
            </button>
            <button className="p-2 hover:bg-white/60 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-[#605A57]" />
            </button>
          </div>
        </div>

        {/* Paper-like Report Container */}
        <div className="relative mb-8">
          {/* Paper shadow layers for depth */}
          <div className="absolute inset-0 bg-white rounded-lg transform translate-y-2 translate-x-2 opacity-30" />
          <div className="absolute inset-0 bg-white rounded-lg transform translate-y-1 translate-x-1 opacity-50" />

          {/* Main paper */}
          <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#37322F_2px,#37322F_3px)]" />

            {/* Header with file info */}
            <div className="border-b-2 border-[#37322F]/10 bg-gradient-to-r from-[#F8F6F4] to-white px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#37322F]/5 rounded-lg">
                  <FileText className="w-8 h-8 text-[#37322F]" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#37322F] mb-2 font-serif">
                    Medical Report Analysis
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-[#605A57]">
                    <span className="font-medium">{fileName}</span>
                    <span>•</span>
                    <span>{(fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="px-8 sm:px-12 py-10">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-[#37322F] mt-8 mb-4 pb-2 border-b-2 border-[#37322F]/20 font-serif">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-[#37322F] mt-6 mb-3 font-serif">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[#37322F] leading-relaxed mb-4 text-base sm:text-lg">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 mb-4 text-[#37322F]">{children}</ul>
                    ),
                    li: ({ children }) => <li className="text-base sm:text-lg leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-[#37322F]">{children}</strong>,
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </div>

            {/* Signature line (decorative) */}
            <div className="px-8 sm:px-12 pb-8">
              <div className="border-t-2 border-[#37322F]/10 pt-6 flex justify-between items-center">
                <div className="text-sm text-[#605A57]">
                  <p className="font-medium">Powered by Tabeer AI</p>
                  <p className="text-xs mt-1">AI-Generated Medical Analysis</p>
                </div>
                <div className="w-32 h-px bg-[#37322F]/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Generation Section */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#37322F]/10 to-[#37322F]/5 rounded-xl">
              <Video className="w-6 h-6 text-[#37322F]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#37322F] mb-2">Generate Video Explanation</h3>
              <p className="text-[#605A57] text-sm sm:text-base">
                Get a personalized video explanation of your report in your preferred language
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-[#37322F] mb-3">
              <Languages className="w-4 h-4" />
              Select Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === lang
                      ? "bg-[#37322F] text-white shadow-lg"
                      : "bg-white/60 text-[#605A57] hover:bg-white/80"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVideo}
            disabled={isGeneratingVideo}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#37322F] to-[#37322F]/90 hover:from-[#37322F]/90 hover:to-[#37322F] text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGeneratingVideo ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Video Script...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Generate Video in {selectedLanguage}
              </>
            )}
          </button>

          {/* Video Script Display */}
          {videoScript && (
            <div className="mt-6 p-6 bg-gradient-to-br from-white/80 to-white/60 rounded-xl border border-white/80">
              <h4 className="text-lg font-bold text-[#37322F] mb-4 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Script ({selectedLanguage})
              </h4>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown className="text-[#37322F] whitespace-pre-wrap leading-relaxed">
                  {videoScript}
                </ReactMarkdown>
              </div>
              <div className="mt-4 pt-4 border-t border-[#37322F]/10">
                <p className="text-xs text-[#605A57] mb-3">
                  Video generation coming soon. For now, you can use this script with text-to-speech services.
                </p>
                <button className="px-4 py-2 bg-[#37322F] text-white rounded-lg text-sm font-medium hover:bg-[#37322F]/90 transition-colors">
                  Download Script
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
