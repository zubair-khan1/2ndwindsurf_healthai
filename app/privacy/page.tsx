"use client"

import { Navbar } from "@/components/navbar"
import FooterSection from "@/components/footer-section"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Hero */}
          <div className="mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold text-[#37322F] mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-[#605A57]">Last updated: January 2025</p>
          </div>

          {/* Content */}
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">Your Privacy Matters</h2>
              <p className="text-[#605A57] leading-relaxed">
                At Tabeer AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal and health information when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-6">Information We Collect</h2>
              <div className="space-y-4 text-[#605A57]">
                <p><strong className="text-[#37322F]">Account Information:</strong> Name, email address, and authentication details</p>
                <p><strong className="text-[#37322F]">Health Reports:</strong> Lab reports and medical documents you upload</p>
                <p><strong className="text-[#37322F]">Usage Data:</strong> How you interact with our platform</p>
                <p><strong className="text-[#37322F]">Preferences:</strong> Language preferences and settings</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-6">How We Use Your Information</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#37322F] mb-2">Report Analysis</h3>
                  <p className="text-[#605A57]">To analyze your health reports and provide personalized explanations</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#37322F] mb-2">Health Tracking</h3>
                  <p className="text-[#605A57]">To store and track your health history over time</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#37322F] mb-2">Service Improvement</h3>
                  <p className="text-[#605A57]">To improve our AI models and provide better service</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-6">Data Security</h2>
              <p className="text-[#605A57] leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <div className="space-y-2 text-[#605A57]">
                <p>• End-to-end encryption for all health data</p>
                <p>• Secure cloud storage with regular backups</p>
                <p>• Access controls and authentication</p>
                <p>• Regular security audits and updates</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-6">Your Rights</h2>
              <div className="space-y-2 text-[#605A57]">
                <p>• Access your personal and health data</p>
                <p>• Request deletion of your data</p>
                <p>• Export your data in a portable format</p>
                <p>• Opt-out of data processing for certain purposes</p>
              </div>
            </section>

            <section className="bg-white/60 backdrop-blur-sm rounded-xl border border-[rgba(55,50,47,0.08)] p-8">
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">Contact Us</h2>
              <p className="text-[#605A57] leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us at{" "}
                <a href="mailto:privacy@tabeer.health" className="text-[#37322F] font-semibold hover:underline">
                  privacy@tabeer.health
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  )
}
