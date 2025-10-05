"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import type { OnboardingData } from "@/components/onboarding-modal"

export function useOnboarding() {
  const { user, isLoaded } = useUser()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsChecking(false)
        return
      }

      // Check if user has completed onboarding
      const hasCompletedOnboarding = user.unsafeMetadata?.hasCompletedOnboarding as boolean
      
      if (!hasCompletedOnboarding) {
        // Small delay for better UX
        setTimeout(() => {
          setShowOnboarding(true)
          setIsChecking(false)
        }, 500)
      } else {
        setIsChecking(false)
      }
    }

    checkOnboardingStatus()
  }, [user, isLoaded])

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) return

    try {
      // Save onboarding data to user metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboardingData: data,
          onboardingCompletedAt: new Date().toISOString(),
          hasCompletedOnboarding: true,
        },
      })

      setShowOnboarding(false)
    } catch (error) {
      console.error("Error saving onboarding data:", error)
    }
  }

  const skipOnboarding = async () => {
    if (!user) return

    try {
      // Mark as skipped but still completed
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          hasCompletedOnboarding: true,
          onboardingSkipped: true,
          onboardingSkippedAt: new Date().toISOString(),
        },
      })

      setShowOnboarding(false)
    } catch (error) {
      console.error("Error skipping onboarding:", error)
    }
  }

  return {
    showOnboarding,
    isChecking,
    completeOnboarding,
    skipOnboarding,
  }
}
