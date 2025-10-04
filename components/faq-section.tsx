"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Tabeer and who is it for?",
    answer:
      "Tabeer is an AI-powered platform that turns complex medical lab reports into simple, local-language explainer videos. It's perfect for patients who want to understand their health reports without medical jargon, and for labs looking to provide better patient education.",
  },
  {
    question: "How does the AI video explanation work?",
    answer:
      "Simply upload your lab report as a PDF or image. Our AI extracts test results, identifies abnormalities, and generates a friendly video explanation in your preferred language (Hindi, Urdu, Bengali, Tamil, etc.) with natural voiceovers.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "We currently support Hindi, Urdu, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, and English. We're continuously adding more regional languages to serve patients across India and beyond.",
  },
  {
    question: "Is my health data secure with Tabeer?",
    answer:
      "Absolutely. We use enterprise-grade security with end-to-end encryption, HIPAA compliance standards, and secure data storage. Your reports are private and only accessible to you. We never share your health data with third parties.",
  },
  {
    question: "Can I connect with a doctor after viewing my report?",
    answer:
      "Yes! After viewing your AI-generated explanation, you have the option to connect with verified doctors for consultation. This helps you take the next steps based on your results.",
  },
  {
    question: "How do labs integrate Tabeer?",
    answer:
      "Labs can integrate our API to automatically send patients their reports along with AI-generated explainer videos. This improves patient satisfaction, reduces support calls, and differentiates your lab services. Contact our team for API access.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Get answers about how Tabeer works,
            <br className="hidden md:block" />
            data security, and language support.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
