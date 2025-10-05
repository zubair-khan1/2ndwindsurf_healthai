"use client"

import { useState } from "react"
import { FileText, Video, Download, Share2, Loader2, Languages, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { ReportChatbot } from "./report-chatbot"

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
  const [isChatOpen, setIsChatOpen] = useState(false)

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
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      {/* Fixed Header - ChatGPT Style */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-[rgba(55,50,47,0.08)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-[#605A57] hover:text-[#37322F] font-medium transition-colors text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-[#F7F5F3] rounded-lg transition-colors" title="Share">
              <Share2 className="w-4 h-4 text-[#605A57]" />
            </button>
            <button className="p-2 hover:bg-[#F7F5F3] rounded-lg transition-colors" title="Download">
              <Download className="w-4 h-4 text-[#605A57]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Centered like ChatGPT */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="space-y-6">

          {/* File Info Card */}
          <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.08)] p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F7F5F3] rounded-lg">
                <FileText className="w-5 h-5 text-[#37322F]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#37322F] truncate">{fileName}</p>
                <p className="text-xs text-[#605A57]">
                  {(fileSize / 1024 / 1024).toFixed(2)} MB • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Report Content - Clean & Centered */}
          <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.08)] p-6 sm:p-8">
            <div className="prose prose-base max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-[#37322F] mt-6 mb-3 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-[#37322F] mt-5 mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[#37322F] leading-relaxed mb-4">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-4 ml-4">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-[#37322F] leading-relaxed flex gap-2">
                      <span className="text-[#605A57] mt-1.5">•</span>
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => <strong className="font-semibold text-[#37322F]">{children}</strong>,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </div>

          {/* Video Generation Section */}
          <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.08)] p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[#37322F] mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Explanation
            </h3>
            <p className="text-[#605A57] text-sm mb-6">
              Get a personalized video explanation in your preferred language
            </p>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[#37322F] mb-3 block">
                Select Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {languages.slice(0, 6).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedLanguage === lang
                        ? "bg-[#37322F] text-white"
                        : "bg-[#F7F5F3] text-[#605A57] hover:bg-[#EDE9E6]"
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
              className="w-full px-6 py-3 bg-[#37322F] hover:bg-[#37322F]/90 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGeneratingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  Generate Video
                </>
              )}
            </button>

            {/* Video Script Display */}
            {videoScript && (
              <div className="mt-6 p-6 bg-[#F7F5F3] rounded-lg">
                <h4 className="text-base font-semibold text-[#37322F] mb-4">
                  Video Script ({selectedLanguage})
                </h4>
                <div className="prose prose-sm max-w-none text-[#37322F] whitespace-pre-wrap leading-relaxed">
                  <ReactMarkdown>
                    {videoScript}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Chat to AI Section */}
          <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.08)] p-6">
            <h3 className="text-lg font-semibold text-[#37322F] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Have Questions About Your Report?
            </h3>
            <p className="text-[#605A57] text-sm mb-4">
              Chat with our AI assistant to get personalized insights and recommendations based on your health report.
            </p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full px-6 py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Chat with AI
            </button>
          </div>

        </div>
      </div>

      {/* Chatbot Component */}
      <ReportChatbot
        analysis={analysis}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        position="bottom"
      />
    </div>
  )
}
