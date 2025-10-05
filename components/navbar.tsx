"use client"

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  
  const ADMIN_EMAIL = "khnnabubakar786@gmail.com"
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === ADMIN_EMAIL

  const handlePricingClick = () => {
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      // If on home page, scroll to pricing
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // If on another page, navigate to home page with pricing hash
      router.push('/#pricing')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#37322F]">
              Tabeer AI
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#37322F] hover:text-[#37322F]/80 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-[#37322F] hover:text-[#37322F]/80 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/call-doctor"
              className="text-[#37322F] hover:text-[#37322F]/80 font-medium transition-colors"
            >
              Call Doctor
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-[#37322F] hover:text-[#37322F]/80 font-medium transition-colors"
              >
                Admin
              </Link>
            )}
            <Link
              href="/api-docs"
              className="text-[#37322F] hover:text-[#37322F]/80 font-medium transition-colors"
            >
              API
            </Link>
            <button
              onClick={handlePricingClick}
              className="text-[#37322F] hover:text-[#37322F]/80 font-medium transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </div>

          {/* Auth Buttons - Right Aligned */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-[#37322F] hover:text-[#37322F]/80 font-medium transition-colors">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-[#37322F] hover:bg-[#37322F]/90 text-white rounded-full font-medium shadow-lg transition-all duration-200 hover:scale-105">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
