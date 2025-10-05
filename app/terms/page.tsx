"use client"

import { Navbar } from "@/components/navbar"
import FooterSection from "@/components/footer-section"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Hero */}
          <div className="mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold text-[#37322F] mb-6 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-[#605A57]">Last updated: January 2025</p>
          </div>

          {/* Content */}
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">1. Acceptance of Terms</h2>
              <p className="text-[#605A57] leading-relaxed">
                By accessing and using Tabeer AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">2. Service Description</h2>
              <p className="text-[#605A57] leading-relaxed mb-4">
                Tabeer AI provides AI-powered analysis of medical reports and health documents. Our service includes:
              </p>
              <div className="space-y-2 text-[#605A57]">
                <p>• Analysis of lab reports and medical documents</p>
                <p>• Multi-language explanations of health data</p>
                <p>• Video generation for health report explanations</p>
                <p>• Health history tracking and management</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">3. Medical Disclaimer</h2>
              <div className="bg-yellow-50/50 border-l-2 border-yellow-600 p-6 rounded">
                <p className="text-[#605A57] leading-relaxed">
                  <strong className="text-[#37322F]">Important:</strong> Tabeer AI is an educational tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding any medical conditions or concerns.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">4. User Responsibilities</h2>
              <p className="text-[#605A57] leading-relaxed mb-4">
                As a user of Tabeer AI, you agree to:
              </p>
              <div className="space-y-2 text-[#605A57]">
                <p>• Provide accurate and complete information</p>
                <p>• Keep your account credentials secure</p>
                <p>• Use the service only for lawful purposes</p>
                <p>• Not share your account with others</p>
                <p>• Respect intellectual property rights</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">5. Data Usage and Privacy</h2>
              <p className="text-[#605A57] leading-relaxed">
                Your use of Tabeer AI is also governed by our Privacy Policy. We collect and process your health data solely to provide our services. Please review our Privacy Policy for detailed information about how we handle your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">6. Limitation of Liability</h2>
              <p className="text-[#605A57] leading-relaxed">
                Tabeer AI and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We do not guarantee the accuracy, completeness, or usefulness of any information provided through our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">7. Service Modifications</h2>
              <p className="text-[#605A57] leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of our service at any time without prior notice. We may also update these terms periodically, and your continued use of the service constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">8. Termination</h2>
              <p className="text-[#605A57] leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section className="bg-white/60 backdrop-blur-sm rounded-xl border border-[rgba(55,50,47,0.08)] p-8">
              <h2 className="text-2xl font-semibold text-[#37322F] mb-4">Contact Information</h2>
              <p className="text-[#605A57] leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@tabeer.health" className="text-[#37322F] font-semibold hover:underline">
                  legal@tabeer.health
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
