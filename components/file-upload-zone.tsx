"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { ReportAnalysis } from "./report-analysis"

interface FileUploadZoneProps {
  compact?: boolean
}

export function FileUploadZone({ compact = false }: FileUploadZoneProps) {
  const { isSignedIn } = useUser()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFamilyModal, setShowFamilyModal] = useState(false)
  const [familyMemberName, setFamilyMemberName] = useState("")
  const [relationship, setRelationship] = useState("Self")
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
    setError(null)

    // Validate type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]
    const ext = file.name.split(".").pop()?.toLowerCase()
    const allowedExt = ["pdf", "jpg", "jpeg", "png"]
    const isTypeOk = allowedTypes.includes(file.type) || (ext ? allowedExt.includes(ext) : false)

    if (!isTypeOk) {
      setError("Unsupported file type. Please upload PDF, JPG, or PNG.")
      return
    }

    // Validate size (<= 10MB)
    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) {
      setError("File too large. Max size is 10MB.")
      return
    }

    // Simulate upload process
    setIsUploading(true)
    setTimeout(() => {
      setUploadedFile(file)
      setIsUploading(false)
    }, 800)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setAnalysis(null)
    setError(null)
  }

  const handleAnalyzeClick = () => {
    if (!uploadedFile) {
      setError("Please upload a file first.")
      return
    }
    
    // Check if user is signed in
    if (!isSignedIn) {
      setError("Please sign in to analyze your report.")
      return
    }
    
    // Show family member modal before analyzing
    setShowFamilyModal(true)
  }

  const analyzeReport = async () => {
    if (!uploadedFile) {
      setError("Please upload a file first.")
      return
    }

    setShowFamilyModal(false)
    setIsValidating(true)
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("familyMemberName", familyMemberName || "Self")
      formData.append("relationship", relationship)

      const response = await fetch("/api/analyze-report", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMsg = data.error || "Failed to analyze report"
        throw new Error(errorMsg)
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("[v0] Error analyzing report:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to analyze report. Please try again."
      setError(errorMsg)
      // Keep the file uploaded so user can see what they tried to upload
      // They can manually remove it using the "Try Another File" button
    } finally {
      setIsAnalyzing(false)
      setIsValidating(false)
    }
  }

  // Auto-scroll to top when analysis is ready (accounting for navbar)
  useEffect(() => {
    if (analysis) {
      // Scroll to top with offset for navbar (64px = navbar height)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }, [analysis])

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

  // Compact version for hero section
  if (compact) {
    return (
      <div className="w-full max-w-[600px] mx-auto">
        {/* Error Message - Show prominently */}
        {error && (
          <div className="mb-4 p-4 rounded-xl border-2 border-red-400 bg-red-50 shadow-lg animate-shake">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-red-800 mb-1 text-lg">
                  {error.includes("doesn't appear to be a health") ? "Invalid Document Type" : "Error"}
                </p>
                <p className="text-red-700 mb-2">{error}</p>
                {!isSignedIn && error.includes("sign in") && (
                  <SignInButton mode="modal">
                    <button className="mt-2 px-4 py-2 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition">
                      Sign In to Continue
                    </button>
                  </SignInButton>
                )}
                {error.includes("doesn't appear to be a health") && (
                  <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800 font-medium mb-2">
                      💡 Please upload one of these:
                    </p>
                    <ul className="text-xs text-red-700 space-y-1 ml-4">
                      <li>• Lab test results (blood tests, urine tests, etc.)</li>
                      <li>• Medical imaging reports (X-ray, MRI, CT scan)</li>
                      <li>• Pathology or diagnostic reports</li>
                      <li>• Health checkup reports</li>
                    </ul>
                  </div>
                )}
                <button
                  onClick={() => {
                    setError(null)
                    setUploadedFile(null)
                  }}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm"
                >
                  Try Another File
                </button>
              </div>
            </div>
          </div>
        )}

        {!uploadedFile ? (
          <div
            className={`
              relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
              ${isDragging ? "scale-[1.02] shadow-2xl" : "scale-100"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input-compact")?.click()}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl" />
            
            {/* Content */}
            <div className="relative p-8 sm:p-10 flex flex-col items-center gap-6">
              {/* Upload Icon */}
              <div className="relative">
                <div className={`absolute inset-0 rounded-full bg-[#37322F]/10 ${isDragging ? "animate-ping" : ""}`} />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/80 border border-[#37322F]/10 shadow-lg flex items-center justify-center">
                  <Upload className={`w-8 h-8 sm:w-10 sm:h-10 text-[#37322F] ${isDragging ? "scale-110" : "scale-100"} transition-transform`} />
                </div>
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-[#37322F] mb-2">Upload Lab Report</h3>
                <p className="text-sm sm:text-base text-[#605A57] mb-4">
                  Drag and drop your PDF or image file here, or click to browse
                </p>
                
                {/* Browse Button */}
                <button className="px-8 py-3 bg-[#37322F] hover:bg-[#37322F]/90 text-white rounded-full font-medium shadow-lg transition-all duration-200 hover:scale-105">
                  Browse Files
                </button>
                
                {/* Supported formats */}
                <p className="text-xs sm:text-sm text-[#605A57] mt-4 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Supports PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              id="file-input-compact"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Animated border on drag */}
            {isDragging && (
              <div className="absolute inset-0 border-2 border-[#37322F] rounded-2xl animate-pulse pointer-events-none" />
            )}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl p-8">
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/80 border border-[#37322F]/10 shadow-lg flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[#37322F]/20 border-t-[#37322F] rounded-full animate-spin" />
                </div>
                <p className="text-lg font-medium text-[#37322F]">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 shadow-lg flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="w-full bg-white/60 rounded-xl p-4 border border-white/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-6 h-6 text-[#37322F] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#37322F] truncate text-sm">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-[#605A57] mt-1">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 hover:bg-white/60 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-[#605A57]" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeClick}
                  disabled={isAnalyzing}
                  className="w-full px-8 py-3 bg-[#37322F] hover:bg-[#37322F]/90 text-white rounded-full font-medium shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isValidating ? "Validating Document..." : "Analyzing Report..."}
                    </>
                  ) : (
                    "Analyze Report"
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Family Member Modal */}
        {showFamilyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-2xl font-bold text-[#37322F] mb-2">Whose report is this?</h3>
              <p className="text-[#605A57] mb-6">Help us organize your health records by family member</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => {
                      setRelationship(e.target.value)
                      if (e.target.value === "Self") {
                        setFamilyMemberName("")
                      }
                    }}
                    className="w-full px-4 py-3 border border-[#E3E2E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  >
                    <option value="Self">Self (My own report)</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {relationship !== "Self" && (
                  <div>
                    <label className="block text-sm font-medium text-[#37322F] mb-2">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={familyMemberName}
                      onChange={(e) => setFamilyMemberName(e.target.value)}
                      placeholder={`Enter ${relationship.toLowerCase()}'s name`}
                      className="w-full px-4 py-3 border border-[#E3E2E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowFamilyModal(false)}
                  className="flex-1 px-4 py-3 border border-[#37322F]/20 text-[#37322F] rounded-lg font-medium hover:bg-[#37322F]/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={analyzeReport}
                  className="flex-1 px-4 py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
          {error && (
            <div className="mb-4 p-4 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">
                    {error.includes("doesn't appear to be a health") ? "Invalid Document Type" : "Error"}
                  </p>
                  <p className="mb-2">{error}</p>
                  {!isSignedIn && error.includes("sign in") && (
                    <SignInButton mode="modal">
                      <button className="mt-2 px-4 py-2 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition">
                        Sign In to Continue
                      </button>
                    </SignInButton>
                  )}
                  {error.includes("doesn't appear to be a health") && (
                    <p className="mt-2 text-xs text-red-600">
                      💡 Please upload a lab test report, medical imaging report, pathology report, or other health-related document.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
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
                    onClick={handleAnalyzeClick}
                    disabled={isAnalyzing}
                    className="px-8 py-3 bg-[#37322F] hover:bg-[#37322F]/90 text-white rounded-full font-medium text-sm sm:text-base shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isValidating ? "Validating Document..." : "Analyzing Report..."}
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

      {/* Family Member Modal */}
      {showFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold text-[#37322F] mb-2">Whose report is this?</h3>
            <p className="text-[#605A57] mb-6">Help us organize your health records by family member</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => {
                    setRelationship(e.target.value)
                    if (e.target.value === "Self") {
                      setFamilyMemberName("")
                    }
                  }}
                  className="w-full px-4 py-3 border border-[#E3E2E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                >
                  <option value="Self">Self (My own report)</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {relationship !== "Self" && (
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={familyMemberName}
                    onChange={(e) => setFamilyMemberName(e.target.value)}
                    placeholder={`Enter ${relationship.toLowerCase()}'s name`}
                    className="w-full px-4 py-3 border border-[#E3E2E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFamilyModal(false)}
                className="flex-1 px-4 py-3 border border-[#37322F]/20 text-[#37322F] rounded-lg font-medium hover:bg-[#37322F]/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={analyzeReport}
                className="flex-1 px-4 py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
