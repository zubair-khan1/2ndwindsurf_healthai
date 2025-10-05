"use client"

import { useState } from "react"
import { X, ArrowRight } from "lucide-react"

interface OnboardingModalProps {
  onComplete: (data: OnboardingData) => void
  onSkip: () => void
}

export interface OnboardingData {
  name: string
  primaryLanguage: string
  healthGoals: string[]
}

export function OnboardingModal({ onComplete, onSkip }: OnboardingModalProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    name: "",
    primaryLanguage: "English",
    healthGoals: [],
  })

  const languages = [
    "English",
    "Hindi",
    "Urdu",
    "Bengali",
    "Tamil",
    "Telugu",
  ]

  const healthGoalOptions = [
    "Understand test results",
    "Track health over time",
    "Monitor family health",
  ]

  const steps = [
    {
      title: "Welcome",
      subtitle: "Let's personalize your experience",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[#605A57] mb-2">Your name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Enter your name"
              autoFocus
              className="w-full px-4 py-3 bg-white border border-[rgba(55,50,47,0.12)] rounded-lg focus:outline-none focus:border-[#37322F] text-[#37322F] placeholder:text-[#605A57]/40"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Preferred language",
      subtitle: "We'll explain your reports in this language",
      content: (
        <div className="grid grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setData({ ...data, primaryLanguage: lang })}
              className={`px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                data.primaryLanguage === lang
                  ? "border-[#37322F] bg-[#37322F] text-white"
                  : "border-[rgba(55,50,47,0.12)] bg-white text-[#37322F] hover:border-[#37322F]"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Your health goals",
      subtitle: "Select what matters to you",
      content: (
        <div className="space-y-2">
          {healthGoalOptions.map((goal) => (
            <button
              key={goal}
              onClick={() => {
                const newGoals = data.healthGoals.includes(goal)
                  ? data.healthGoals.filter((g) => g !== goal)
                  : [...data.healthGoals, goal]
                setData({ ...data, healthGoals: newGoals })
              }}
              className={`w-full px-4 py-3 rounded-lg border text-left transition-all text-sm ${
                data.healthGoals.includes(goal)
                  ? "border-[#37322F] bg-[#37322F]/5"
                  : "border-[rgba(55,50,47,0.12)] bg-white hover:border-[#37322F]"
              }`}
            >
              <span className="text-[#37322F] font-medium">{goal}</span>
            </button>
          ))}
        </div>
      ),
    },
  ]

  const currentStep = steps[step]
  const isLastStep = step === steps.length - 1
  const canProceed = step === 0 ? data.name.trim() !== "" : true

  const handleNext = () => {
    if (isLastStep) {
      onComplete(data)
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#37322F]/20 backdrop-blur-sm">
      <div className="bg-[#F7F5F3] rounded-xl shadow-[0px_2px_4px_rgba(55,50,47,0.12)] w-full max-w-lg border border-[rgba(55,50,47,0.06)]">
        {/* Header */}
        <div className="relative px-6 py-6 border-b border-[rgba(55,50,47,0.06)]">
          <button
            onClick={onSkip}
            className="absolute top-6 right-6 text-[#605A57] hover:text-[#37322F] transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === step ? "bg-[#37322F] w-8" : index < step ? "bg-[#37322F]/40 w-1" : "bg-[#37322F]/10 w-1"
                }`}
              />
            ))}
          </div>
          
          <h2 className="text-xl font-semibold text-[#37322F] mb-1">{currentStep.title}</h2>
          <p className="text-sm text-[#605A57]">{currentStep.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6">{currentStep.content}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(55,50,47,0.06)] flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-[#605A57] hover:text-[#37322F] transition"
          >
            Skip
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-5 py-2 bg-[#37322F] text-white rounded-full text-sm font-medium hover:bg-[#37322F]/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLastStep ? "Get started" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
