"use client"

import { Navbar } from "@/components/navbar"
import FooterSection from "@/components/footer-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Hero */}
          <div className="mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold text-[#37322F] mb-6 tracking-tight">
              About Tabeer
            </h1>
            <p className="text-xl text-[#605A57] leading-relaxed">
              Making healthcare accessible and understandable for everyone, regardless of language or medical knowledge.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-20">
            <h2 className="text-2xl font-semibold text-[#37322F] mb-4">Our Mission</h2>
            <div className="space-y-4 text-[#605A57] leading-relaxed">
              <p>
                At Tabeer AI, we believe that understanding your health should never be a barrier. Medical reports are often filled with complex terminology that can be confusing and overwhelming.
              </p>
              <p>
                Our mission is to bridge this gap by transforming complex lab reports into clear, simple explanations that anyone can understand. We leverage cutting-edge AI technology to analyze your health reports and provide personalized explanations in your native language.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-2xl font-semibold text-[#37322F] mb-8">What We Stand For</h2>
            <div className="space-y-8">
              <div className="border-l-2 border-[#37322F] pl-6">
                <h3 className="text-lg font-semibold text-[#37322F] mb-2">Patient-Centric</h3>
                <p className="text-[#605A57]">
                  Every feature we build is designed with patients in mind. Your health, your language, your understanding.
                </p>
              </div>
              <div className="border-l-2 border-[#37322F] pl-6">
                <h3 className="text-lg font-semibold text-[#37322F] mb-2">Inclusive</h3>
                <p className="text-[#605A57]">
                  Healthcare information should be accessible to everyone. We support multiple languages and make medical knowledge universal.
                </p>
              </div>
              <div className="border-l-2 border-[#37322F] pl-6">
                <h3 className="text-lg font-semibold text-[#37322F] mb-2">Innovation</h3>
                <p className="text-[#605A57]">
                  We use the latest AI technology to make healthcare more transparent, understandable, and accessible.
                </p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-[rgba(55,50,47,0.08)] p-8">
            <h2 className="text-2xl font-semibold text-[#37322F] mb-4">Our Story</h2>
            <div className="space-y-4 text-[#605A57] leading-relaxed">
              <p>
                Tabeer AI was born from a simple observation: millions of people receive medical reports every day, but struggle to understand what they mean. Language barriers, medical jargon, and lack of context make it difficult for patients to truly grasp their health status.
              </p>
              <p>
                We set out to change this by combining artificial intelligence with a deep understanding of healthcare communication. Today, Tabeer AI helps thousands of people understand their health reports in their native language, making healthcare more accessible and empowering patients to make informed decisions about their health.
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  )
}
