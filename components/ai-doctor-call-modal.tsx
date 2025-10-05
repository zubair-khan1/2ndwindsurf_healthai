"use client"

import { useState } from "react"
import { X, Phone, Loader2 } from "lucide-react"

interface AIDoctorCallModalProps {
  isOpen: boolean
  onClose: () => void
  healthContext?: string
}

export function AIDoctorCallModal({ isOpen, onClose, healthContext }: AIDoctorCallModalProps) {
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "connected" | "ended">("idle")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCall = async () => {
    setCallStatus("connecting")
    setError(null)

    try {
      // Generate script based on health context
      const script = healthContext
        ? `Hello! I'm your AI health assistant. I've reviewed your health report. ${healthContext}. How can I help you understand your results better?`
        : "Hello! I'm your AI health assistant. I'm here to help you understand your health reports and answer any questions you may have about your test results."

      console.log("Starting AI doctor call with script:", script)

      const response = await fetch("/api/ai-doctor-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: script,
          language: "english",
        }),
      })

      const data = await response.json()
      console.log("AI doctor call response:", data)

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to start call")
      }

      // Check for video URL in response
      const videoUrl = data.preview_url || data.video_url || data.data?.preview_url || data.data?.video_url
      
      if (videoUrl) {
        setVideoUrl(videoUrl)
        setCallStatus("connected")
      } else {
        console.error("No video URL in response:", data)
        throw new Error("No video URL received from server. Response: " + JSON.stringify(data))
      }
    } catch (err) {
      console.error("Error starting call:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to AI doctor. Please try again."
      setError(errorMessage)
      setCallStatus("idle")
    }
  }

  const endCall = () => {
    setCallStatus("ended")
    setTimeout(() => {
      onClose()
      setCallStatus("idle")
      setVideoUrl(null)
      setError(null)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[rgba(55,50,47,0.08)]">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-[rgba(55,50,47,0.08)] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#37322F]">AI Health Assistant</h2>
            <p className="text-sm text-[#605A57] mt-0.5">
              {callStatus === "idle" && "Ready to connect"}
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "connected" && "In call"}
              {callStatus === "ended" && "Call ended"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F7F5F3] rounded-full transition text-[#605A57] hover:text-[#37322F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Content */}
        <div className="p-8">
          {/* Idle State - Before Call */}
          {callStatus === "idle" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[#37322F] rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#37322F] mb-3">
                Start Video Consultation
              </h3>
              <p className="text-[#605A57] mb-8 max-w-md mx-auto leading-relaxed">
                Get personalized explanations about your health reports through an AI-powered video consultation.
              </p>
              {error && (
                <div className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-lg text-sm text-red-800 max-w-md mx-auto">
                  {error}
                </div>
              )}
              <button
                onClick={startCall}
                className="px-8 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#37322F]/90 transition inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Start Call
              </button>
            </div>
          )}

          {/* Connecting State */}
          {callStatus === "connecting" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[#37322F] rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold text-[#37322F] mb-3">
                Connecting...
              </h3>
              <p className="text-[#605A57]">
                Preparing your consultation
              </p>
            </div>
          )}

          {/* Connected State - Video Call */}
          {callStatus === "connected" && videoUrl && (
            <div className="space-y-6">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Call Controls */}
              <div className="flex items-center justify-center">
                <button
                  onClick={endCall}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 rotate-135" />
                  End Call
                </button>
              </div>
            </div>
          )}

          {/* Ended State */}
          {callStatus === "ended" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#37322F] mb-3">
                Call Ended
              </h3>
              <p className="text-[#605A57]">
                Thank you for using our service
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
