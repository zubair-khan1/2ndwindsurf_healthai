"use client"

import { useState } from "react"
import { X, ArrowRight, ArrowLeft, User, Phone, Mail, MessageSquare, Calendar } from "lucide-react"

interface BookingWizardProps {
  onComplete: (data: BookingFormData) => void
  onClose: () => void
}

export interface BookingFormData {
  name: string
  phone: string
  email: string
  concern: string
  preferredTime: string
}

export function BookingWizard({ onComplete, onClose }: BookingWizardProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<BookingFormData>({
    name: "",
    phone: "",
    email: "",
    concern: "",
    preferredTime: "",
  })

  const steps = [
    {
      title: "Your Name",
      subtitle: "Let's start with your name",
      icon: User,
      field: "name" as keyof BookingFormData,
      type: "text",
      placeholder: "Enter your full name",
      validation: (value: string) => value.trim().length >= 2,
      errorMessage: "Please enter your name (at least 2 characters)",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-[#37322F]/5 rounded-full">
              <User className="w-12 h-12 text-[#37322F]" />
            </div>
          </div>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Enter your full name"
            autoFocus
            className="w-full px-5 py-4 bg-white border-2 border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:border-[#37322F] text-[#37322F] placeholder:text-[#605A57]/40 text-lg transition-all"
          />
        </div>
      ),
    },
    {
      title: "Phone Number",
      subtitle: "How can we reach you?",
      icon: Phone,
      field: "phone" as keyof BookingFormData,
      type: "tel",
      placeholder: "Enter your phone number",
      validation: (value: string) => /^[0-9]{10,}$/.test(value.replace(/[^0-9]/g, "")),
      errorMessage: "Please enter a valid phone number (at least 10 digits)",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-[#37322F]/5 rounded-full">
              <Phone className="w-12 h-12 text-[#37322F]" />
            </div>
          </div>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="Enter your phone number"
            autoFocus
            className="w-full px-5 py-4 bg-white border-2 border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:border-[#37322F] text-[#37322F] placeholder:text-[#605A57]/40 text-lg transition-all"
          />
          <p className="text-xs text-[#605A57] text-center">
            We'll send WhatsApp confirmation to this number
          </p>
        </div>
      ),
    },
    {
      title: "Email Address",
      subtitle: "We'll send your receipt here",
      icon: Mail,
      field: "email" as keyof BookingFormData,
      type: "email",
      placeholder: "Enter your email",
      validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMessage: "Please enter a valid email address",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-[#37322F]/5 rounded-full">
              <Mail className="w-12 h-12 text-[#37322F]" />
            </div>
          </div>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="Enter your email"
            autoFocus
            className="w-full px-5 py-4 bg-white border-2 border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:border-[#37322F] text-[#37322F] placeholder:text-[#605A57]/40 text-lg transition-all"
          />
        </div>
      ),
    },
    {
      title: "Health Concern",
      subtitle: "What brings you here today?",
      icon: MessageSquare,
      field: "concern" as keyof BookingFormData,
      type: "textarea",
      placeholder: "Describe your health concern",
      validation: (value: string) => value.trim().length >= 10,
      errorMessage: "Please provide more details (at least 10 characters)",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-[#37322F]/5 rounded-full">
              <MessageSquare className="w-12 h-12 text-[#37322F]" />
            </div>
          </div>
          <textarea
            value={data.concern}
            onChange={(e) => setData({ ...data, concern: e.target.value })}
            placeholder="Describe your health concern"
            autoFocus
            rows={5}
            className="w-full px-5 py-4 bg-white border-2 border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:border-[#37322F] text-[#37322F] placeholder:text-[#605A57]/40 text-lg resize-none transition-all"
          />
        </div>
      ),
    },
    {
      title: "Preferred Time",
      subtitle: "When would you like to consult?",
      icon: Calendar,
      field: "preferredTime" as keyof BookingFormData,
      type: "datetime-local",
      placeholder: "",
      validation: (value: string) => {
        if (!value) return false
        const selectedDate = new Date(value)
        const now = new Date()
        return selectedDate > now
      },
      errorMessage: "Please select a future date and time",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-[#37322F]/5 rounded-full">
              <Calendar className="w-12 h-12 text-[#37322F]" />
            </div>
          </div>
          <input
            type="datetime-local"
            value={data.preferredTime}
            onChange={(e) => setData({ ...data, preferredTime: e.target.value })}
            autoFocus
            min={new Date(Date.now() + 3600000).toISOString().slice(0, 16)}
            className="w-full px-5 py-4 bg-white border-2 border-[rgba(55,50,47,0.12)] rounded-xl focus:outline-none focus:border-[#37322F] text-[#37322F] text-lg transition-all"
          />
          <p className="text-xs text-[#605A57] text-center">
            Doctor will contact you via WhatsApp at this time
          </p>
        </div>
      ),
    },
  ]

  const currentStep = steps[step]
  const isLastStep = step === steps.length - 1
  const isFirstStep = step === 0
  const currentValue = data[currentStep.field]
  const canProceed = currentStep.validation(currentValue)

  const handleNext = () => {
    if (!canProceed) return
    
    if (isLastStep) {
      onComplete(data)
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setStep(step - 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed && currentStep.type !== "textarea") {
      e.preventDefault()
      handleNext()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#F7F5F3] rounded-2xl shadow-2xl w-full max-w-lg border border-[rgba(55,50,47,0.06)]">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-[rgba(55,50,47,0.06)]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#605A57] hover:text-[#37322F] transition p-1 hover:bg-[rgba(55,50,47,0.05)] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === step 
                    ? "bg-[#37322F] w-12" 
                    : index < step 
                    ? "bg-[#37322F]/40 w-8" 
                    : "bg-[#37322F]/10 w-8"
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#605A57] mb-2">
            <span>Step {step + 1} of {steps.length}</span>
          </div>
          <h2 className="text-2xl font-semibold text-[#37322F] mb-1">{currentStep.title}</h2>
          <p className="text-sm text-[#605A57]">{currentStep.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-8" onKeyPress={handleKeyPress}>
          {currentStep.content}
          
          {/* Error message */}
          {currentValue && !canProceed && (
            <p className="text-sm text-red-600 mt-3 text-center animate-in fade-in duration-200">
              {currentStep.errorMessage}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[rgba(55,50,47,0.06)] flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              isFirstStep
                ? "text-[#605A57]/30 cursor-not-allowed"
                : "text-[#605A57] hover:text-[#37322F] hover:bg-[rgba(55,50,47,0.05)]"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-2.5 bg-[#37322F] text-white rounded-xl text-sm font-medium hover:bg-[#37322F]/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#37322F]/20"
          >
            {isLastStep ? "Complete Booking" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
