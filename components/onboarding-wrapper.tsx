"use client"

import { OnboardingModal } from "./onboarding-modal"
import { useOnboarding } from "@/hooks/use-onboarding"

export function OnboardingWrapper() {
  const { showOnboarding, isChecking, completeOnboarding, skipOnboarding } = useOnboarding()

  // Don't render anything while checking
  if (isChecking) {
    return null
  }

  // Only show onboarding modal if needed
  if (!showOnboarding) {
    return null
  }

  return <OnboardingModal onComplete={completeOnboarding} onSkip={skipOnboarding} />
}
