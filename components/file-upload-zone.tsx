"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react"
import { ReportAnalysis } from "./report-analysis"

export function FileUploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<{
    analysis: string
    fileName: string
    fileSize: number
  } | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = (file: File) => {
    // Simulate upload process
    setIsUploading(true)
    setTimeout(() => {
      setUploadedFile(file)
      setIsUploading(false)
    }, 1500)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setAnalysis(null)
  }

  const analyzeReport = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch("/api/analyze-report", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze report")
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("[v0] Error analyzing report:", error)
      alert("Failed to analyze report. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (analysis) {
    return (
      <ReportAnalysis
        analysis={analysis.analysis}
        fileName={analysis.fileName}
        fileSize={analysis.fileSize}
        onBack={() => setAnalysis(null)}
      />
    )
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6 md:px-8">
      <div
        className={`
          relative overflow-hidden rounded-2xl transition-all duration-300
          ${isDragging ? "scale-[1.02]" : "scale-100"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(55,50,47,0.12)]" />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30 pointer-events-none" />

        {/* Content */}
        <div className="relative p-8 sm:p-10 md:p-12 lg:p-16">
          {!uploadedFile ? (
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Upload Icon with animated ring */}
              <div className="relative">
                <div
                  className={`
                    absolute inset-0 rounded-full bg-gradient-to-br from-[#37322F]/20 to-[#37322F]/5
                    ${isDragging ? "animate-ping" : ""}
                  `}
                />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg flex items-center justify-center">
                  <Upload
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-[#37322F] transition-transform duration-300 ${
                      isDragging ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-3">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#37322F] font-sans">
                  {isDragging ? "Drop your report here" : "Upload Lab Report"}
                </h3>
                <p className="text-sm sm:text-base text-[#605A57] font-medium max-w-md">
                  Drag and drop your PDF or image file here, or click to browse
                </p>
              </div>

              {/* File Input */}
              <label className="cursor-pointer group">
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                <div className="px-8 py-3 bg-[#37322F] hover:bg-[#37322F]/90 text-white rounded-full font-medium text-sm sm:text-base shadow-lg transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl">
                  Browse Files
                </div>
              </label>

              {/* Supported formats */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#605A57]/80">
                <FileText className="w-4 h-4" />
                <span>Supports PDF, JPG, PNG (Max 10MB)</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Success State */}
              {isUploading ? (
                <>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#37322F]/20 border-t-[#37322F] rounded-full animate-spin" />
                  </div>
                  <p className="text-lg sm:text-xl font-medium text-[#37322F]">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/40 shadow-lg flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                  </div>

                  {/* File Info */}
                  <div className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/80 shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="w-8 h-8 text-[#37322F] flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#37322F] truncate text-sm sm:text-base">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs sm:text-sm text-[#605A57] mt-1">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-2 hover:bg-white/60 rounded-full transition-colors flex-shrink-0"
                      >
                        <X className="w-5 h-5 text-[#605A57]" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={analyzeReport}
                    disabled={isAnalyzing}
                    className="px-8 py-3 bg-[#37322F] hover:bg-[#37322F]/90 text-white rounded-full font-medium text-sm sm:text-base shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Report...
                      </>
                    ) : (
                      "Analyze Report"
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Animated border effect on drag */}
        {isDragging && (
          <div className="absolute inset-0 border-2 border-[#37322F] rounded-2xl animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  )
}
