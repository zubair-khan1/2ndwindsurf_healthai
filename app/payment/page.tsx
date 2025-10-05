"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { CheckCircle, Copy, ArrowLeft, Loader2, Crown } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

interface PlanDetails {
  name: string
  price: number
  features: string[]
}

const PLANS: Record<string, PlanDetails> = {
  basic: {
    name: "Starter Plan",
    price: 1,
    features: ["1 Report Analysis", "Basic AI Insights", "Email Support"],
  },
  pro: {
    name: "Pro Plan",
    price: 999,
    features: ["Unlimited Reports", "Advanced AI Insights", "Priority Support", "Video Consultations"],
  },
  enterprise: {
    name: "Enterprise Plan",
    price: 2499,
    features: ["Unlimited Reports", "Custom AI Models", "24/7 Support", "API Access", "Dedicated Account Manager"],
  },
}

const UPI_ID = "khnnabubakar786@paytm"
const QR_CODE_URL = "/qr-code-payment.png" // You'll need to generate this

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const [plan, setPlan] = useState<string | null>(null)
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkSubscription()
    const planParam = searchParams.get("plan")
    if (planParam && PLANS[planParam]) {
      setPlan(planParam)
      setPlanDetails(PLANS[planParam])
    } else {
      router.push("/#pricing")
    }
  }, [searchParams, router])

  const checkSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/status")
      const data = await response.json()
      if (data.success && data.hasActiveSubscription) {
        // User already has active subscription, redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error checking subscription:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitPayment = async () => {
    if (!transactionId.trim() || !plan || !user) {
      alert("Please enter transaction ID")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/subscriptions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          amount: planDetails?.price,
          transactionId,
          upiId: UPI_ID,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccess(true)
      } else {
        alert(data.error || "Failed to submit payment")
      }
    } catch (error) {
      console.error("Error submitting payment:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!planDetails) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F5F3] pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37322F]"></div>
        </div>
      </>
    )
  }

  if (showSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F5F3] pt-20 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#37322F] mb-4">Payment Submitted!</h2>
            <p className="text-[#605A57] mb-6">
              Your payment has been submitted for verification. You'll receive a confirmation email once the admin approves your subscription.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#37322F] font-medium mb-2">Transaction ID</p>
              <p className="text-sm font-mono text-[#605A57]">{transactionId}</p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F5F3] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#605A57] hover:text-[#37322F] mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#37322F] mb-2">Complete Your Payment</h1>
            <p className="text-[#605A57]">Scan QR code or use UPI ID to pay</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[rgba(55,50,47,0.08)]">
              <h2 className="text-xl font-bold text-[#37322F] mb-6">Payment Details</h2>
              
              {/* Plan Info */}
              <div className="bg-gradient-to-br from-[#37322F] to-[#605A57] rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5" />
                  <p className="text-sm opacity-90">Selected Plan</p>
                </div>
                <h3 className="text-2xl font-bold mb-4">{planDetails.name}</h3>
                <div className="space-y-2 mb-4">
                  {planDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
                  <p className="text-4xl font-bold">₹{planDetails.price}</p>
                  <p className="text-sm opacity-75 mt-1">per month</p>
                </div>
              </div>

              {/* UPI Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">UPI ID</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={UPI_ID}
                      readOnly
                      className="flex-1 px-4 py-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.2)] rounded-lg text-[#37322F] font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(UPI_ID)}
                      className="p-3 bg-[#37322F] text-white rounded-lg hover:bg-[#37322F]/90 transition"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">Amount</label>
                  <input
                    type="text"
                    value={`₹${planDetails.price}`}
                    readOnly
                    className="w-full px-4 py-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.2)] rounded-lg text-[#37322F] font-bold text-lg"
                  />
                </div>
              </div>
            </div>

            {/* QR Code & Transaction */}
            <div className="space-y-6">
              {/* QR Code */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-[rgba(55,50,47,0.08)]">
                <h3 className="text-lg font-semibold text-[#37322F] mb-4 text-center">
                  Scan QR Code to Pay
                </h3>
                <div className="bg-[#F7F5F3] rounded-xl p-6 flex items-center justify-center mb-4">
                  {/* QR Code */}
                  <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-2 border-[rgba(55,50,47,0.1)] p-4">
                    <Image 
                      src="/qr-code-payment.png" 
                      alt="UPI Payment QR Code" 
                      width={240}
                      height={240}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-sm text-center text-[#605A57]">
                  Use Google Pay, PhonePe, Paytm, or any UPI app
                </p>
              </div>

              {/* Transaction ID Input */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-[rgba(55,50,47,0.08)]">
                <h3 className="text-lg font-semibold text-[#37322F] mb-4">
                  Submit Transaction Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#37322F] mb-2">
                      Transaction ID / UTR Number *
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter your transaction ID"
                      className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] focus:border-transparent"
                    />
                    <p className="text-xs text-[#605A57] mt-1">
                      You'll find this in your payment app after completing the transaction
                    </p>
                  </div>

                  <button
                    onClick={handleSubmitPayment}
                    disabled={!transactionId.trim() || isSubmitting}
                    className="w-full py-4 bg-[#37322F] text-white rounded-lg font-semibold hover:bg-[#37322F]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Payment"
                    )}
                  </button>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-[#37322F] font-medium mb-2">📌 Important</p>
                <ul className="text-sm text-[#605A57] space-y-1">
                  <li>• Complete the payment using the QR code or UPI ID</li>
                  <li>• Enter the transaction ID from your payment app</li>
                  <li>• Admin will verify and activate your subscription within 24 hours</li>
                  <li>• You'll receive an email confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
