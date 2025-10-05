"use client"

import { Navbar } from "@/components/navbar"
import FooterSection from "@/components/footer-section"

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your lab reports and medical documents, extracting key information and providing detailed explanations for every test result.",
    },
    {
      title: "Multi-Language Support",
      description: "Get explanations in your native language. We support English, Hindi, Urdu, Bengali, Tamil, Telugu, and more regional languages.",
    },
    {
      title: "Video Explanations",
      description: "Watch personalized video explanations of your health reports with AI-generated avatars speaking in your preferred language.",
    },
    {
      title: "Secure & Private",
      description: "Your health data is encrypted and stored securely. We follow strict privacy standards to protect your sensitive medical information.",
    },
    {
      title: "Health History Tracking",
      description: "Track your health journey over time. All your reports are saved in one place, making it easy to monitor trends and changes.",
    },
    {
      title: "Family Health Management",
      description: "Manage health reports for your entire family. Organize reports by family member and track everyone's health in one dashboard.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Hero */}
          <div className="mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold text-[#37322F] mb-6 tracking-tight">
              Features
            </h1>
            <p className="text-xl text-[#605A57] leading-relaxed">
              Everything you need to understand and manage your health reports in one place.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-16 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="border-b border-[rgba(55,50,47,0.08)] pb-12 last:border-0">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-sm text-[#605A57] font-mono">0{index + 1}</span>
                  <h2 className="text-2xl font-semibold text-[#37322F]">{feature.title}</h2>
                </div>
                <p className="text-[#605A57] leading-relaxed ml-12">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-[rgba(55,50,47,0.08)] p-8">
            <h2 className="text-2xl font-semibold text-[#37322F] mb-8">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#37322F] text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-[#37322F] mb-1">Upload Report</h3>
                  <p className="text-sm text-[#605A57]">Upload your lab report (PDF or image)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#37322F] text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-[#37322F] mb-1">AI Analysis</h3>
                  <p className="text-sm text-[#605A57]">Our AI analyzes every test result</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#37322F] text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-[#37322F] mb-1">Get Explanation</h3>
                  <p className="text-sm text-[#605A57]">Receive detailed explanations in your language</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#37322F] text-white flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-[#37322F] mb-1">Track Progress</h3>
                  <p className="text-sm text-[#605A57]">Monitor your health over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  )
}
