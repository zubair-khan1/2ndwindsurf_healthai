"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { 
  Phone, 
  Video, 
  Clock, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Sparkles,
  Bot,
  User,
  Calendar,
  Shield,
  Star
} from "lucide-react"

interface Booking {
  bookingId: string
  name: string
  phone: string
  email: string
  concern: string
  preferredTime: string
  bookingTime: string
  status: string
  paymentStatus: string
  amount: number
  whatsappNumber: string
}

export default function CallDoctorPage() {
  const [selectedService, setSelectedService] = useState<"ai" | "real" | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    concern: "",
    preferredTime: "",
  })

  // Fetch existing bookings on mount - only for logged in user
  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/book-doctor")
      const data = await response.json()
      
      if (data.success && data.bookings && data.bookings.length > 0) {
        // Get the most recent pending booking for this user
        const pendingBooking = data.bookings.find((b: Booking) => b.status === "pending" || b.status === "confirmed")
        if (pendingBooking) {
          setCurrentBooking(pendingBooking)
        }
      } else if (data.error === "Unauthorized") {
        // User not logged in, don't show booking
        setCurrentBooking(null)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setCurrentBooking(null)
    }
  }

  const handleAIConsultation = () => {
    // Redirect to AI Doctor Call (Jogg.ai integration)
    window.location.href = "/#upload"
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("/api/book-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentBooking(data.booking)
        setShowReceipt(true)
        setShowBookingForm(false)
        setFormData({
          name: "",
          phone: "",
          email: "",
          concern: "",
          preferredTime: "",
        })
      } else {
        alert("Booking failed. Please try again.")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("An error occurred. Please try again.")
    }
  }

  const downloadReceipt = () => {
    if (!currentBooking) return
    
    const receiptContent = `
TABEER AI - DOCTOR CONSULTATION RECEIPT
========================================

Booking ID: ${currentBooking.bookingId}
Date: ${new Date(currentBooking.bookingTime).toLocaleString()}

PATIENT DETAILS:
Name: ${currentBooking.name}
Phone: ${currentBooking.phone}
Email: ${currentBooking.email}

CONSULTATION DETAILS:
Concern: ${currentBooking.concern}
Scheduled Time: ${new Date(currentBooking.preferredTime).toLocaleString()}
Status: ${currentBooking.status.toUpperCase()}

PAYMENT DETAILS:
Amount: ₹${currentBooking.amount}
Payment Status: ${currentBooking.paymentStatus.toUpperCase()}

WhatsApp Number: ${currentBooking.whatsappNumber}

Note: You will receive a WhatsApp message before your consultation.
Our doctor will contact you via WhatsApp video call at the scheduled time.

Thank you for choosing Tabeer AI!
    `
    
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${currentBooking.bookingId}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const openWhatsApp = () => {
    if (!currentBooking) return
    const message = `Hi, I have booked a doctor consultation. My Booking ID is: ${currentBooking.bookingId}`
    window.open(`https://wa.me/${currentBooking.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F5F3] pt-20">
        {/* Active Booking Status Banner */}
        {currentBooking && !showReceipt && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#37322F]">Active Booking</p>
                    <p className="text-sm text-[#605A57]">
                      Booking ID: <span className="font-mono font-bold">{currentBooking.bookingId}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReceipt(true)}
                  className="px-4 py-2 bg-[#37322F] text-white rounded-lg text-sm font-medium hover:bg-[#37322F]/90 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#37322F] mb-4">
              Online Doctor Consultation
            </h1>
            <p className="text-xl text-[#605A57] mb-2">
              with Qualified Doctors & AI Assistants
            </p>
            <p className="text-lg text-[#605A57]">
              Starting at <span className="font-bold text-[#37322F]">₹199</span>
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[rgba(55,50,47,0.08)]">
              <div className="p-3 bg-[#37322F]/5 rounded-full">
                <Clock className="w-6 h-6 text-[#37322F]" />
              </div>
              <div>
                <p className="font-semibold text-[#37322F]">Talk within 30 min</p>
                <p className="text-sm text-[#605A57]">Quick response time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[rgba(55,50,47,0.08)]">
              <div className="p-3 bg-[#37322F]/5 rounded-full">
                <MessageSquare className="w-6 h-6 text-[#37322F]" />
              </div>
              <div>
                <p className="font-semibold text-[#37322F]">Free follow up for 3 days</p>
                <p className="text-sm text-[#605A57]">Continued care</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[rgba(55,50,47,0.08)]">
              <div className="p-3 bg-[#37322F]/5 rounded-full">
                <FileText className="w-6 h-6 text-[#37322F]" />
              </div>
              <div>
                <p className="font-semibold text-[#37322F]">Get a valid prescription</p>
                <p className="text-sm text-[#605A57]">Digital prescription</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-lg p-8 text-center border border-[rgba(55,50,47,0.08)]">
              <h3 className="text-5xl font-bold text-[#37322F] mb-2">30L+</h3>
              <p className="text-[#605A57] font-medium">Total Consultations</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center border border-[rgba(55,50,47,0.08)]">
              <h3 className="text-5xl font-bold text-[#37322F] mb-2">3k+</h3>
              <p className="text-[#605A57] font-medium">Daily Consultations</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center border border-[rgba(55,50,47,0.08)]">
              <h3 className="text-5xl font-bold text-[#37322F] mb-2">22+</h3>
              <p className="text-[#605A57] font-medium">Specialities</p>
            </div>
          </div>

          {/* Service Selection */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#37322F] text-center mb-8">
              Choose Your Consultation Type
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* AI Doctor Consultation */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[rgba(55,50,47,0.08)] hover:border-[#37322F] transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#37322F] to-[#605A57] rounded-full">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#37322F]">AI Doctor</h3>
                    <p className="text-sm text-[#605A57]">Instant consultation</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-3xl font-bold text-[#37322F] mb-2">Free</p>
                  <p className="text-[#605A57] mb-4">24/7 Available</p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Instant AI-powered analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Video consultation with AI avatar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Personalized health recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Chat support for follow-up questions</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleAIConsultation}
                  className="w-full py-4 bg-[#37322F] text-white rounded-xl font-semibold hover:bg-[#37322F]/90 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start AI Consultation
                </button>
              </div>

              {/* Real Doctor Consultation */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[rgba(55,50,47,0.08)] hover:border-[#37322F] transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#37322F] to-[#605A57] rounded-full">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#37322F]">Real Doctor</h3>
                    <p className="text-sm text-[#605A57]">Qualified professionals</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-3xl font-bold text-[#37322F] mb-2">₹199</p>
                  <p className="text-[#605A57] mb-4">Per consultation</p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Consultation with licensed doctors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Video/audio call consultation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Valid prescription provided</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#605A57]">Free follow-up for 3 days</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full py-4 bg-[#37322F] text-white rounded-xl font-semibold hover:bg-[#37322F]/90 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Book Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Specialities Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#37322F] text-center mb-8">
              Available Specialities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "General Physician",
                "Dermatology",
                "Pediatrics",
                "Gynecology",
                "Psychiatry",
                "Cardiology",
                "Orthopedics",
                "ENT",
              ].map((speciality) => (
                <div
                  key={speciality}
                  className="bg-white rounded-lg p-4 text-center border border-[rgba(55,50,47,0.08)] hover:border-[#37322F] transition-all"
                >
                  <p className="text-[#37322F] font-medium">{speciality}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center border border-[rgba(55,50,47,0.08)]">
                <Shield className="w-12 h-12 text-[#37322F] mx-auto mb-3" />
                <h4 className="font-semibold text-[#37322F] mb-2">100% Safe & Secure</h4>
                <p className="text-sm text-[#605A57]">Your data is encrypted and protected</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border border-[rgba(55,50,47,0.08)]">
                <Star className="w-12 h-12 text-[#37322F] mx-auto mb-3" />
                <h4 className="font-semibold text-[#37322F] mb-2">Verified Doctors</h4>
                <p className="text-sm text-[#605A57]">All doctors are licensed professionals</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center border border-[rgba(55,50,47,0.08)]">
                <Clock className="w-12 h-12 text-[#37322F] mx-auto mb-3" />
                <h4 className="font-semibold text-[#37322F] mb-2">24/7 Support</h4>
                <p className="text-sm text-[#605A57]">AI consultation available anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceipt && currentBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-[#37322F] mb-2">Booking Confirmed!</h2>
                <p className="text-[#605A57]">Your consultation has been scheduled</p>
              </div>

              {/* Booking Details Card */}
              <div className="bg-gradient-to-br from-[#F7F5F3] to-white rounded-xl p-6 mb-6 border border-[rgba(55,50,47,0.1)]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[rgba(55,50,47,0.1)]">
                  <div>
                    <p className="text-sm text-[#605A57] mb-1">Booking ID</p>
                    <p className="text-2xl font-bold font-mono text-[#37322F]">{currentBooking.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#605A57] mb-1">Status</p>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      {currentBooking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#605A57] mb-1">Patient Name</p>
                    <p className="font-semibold text-[#37322F]">{currentBooking.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#605A57] mb-1">Phone Number</p>
                    <p className="font-semibold text-[#37322F]">{currentBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#605A57] mb-1">Email</p>
                    <p className="font-semibold text-[#37322F]">{currentBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#605A57] mb-1">Scheduled Time</p>
                    <p className="font-semibold text-[#37322F]">
                      {new Date(currentBooking.preferredTime).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-[#605A57] mb-1">Health Concern</p>
                  <p className="font-semibold text-[#37322F]">{currentBooking.concern}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[rgba(55,50,47,0.1)]">
                  <div>
                    <p className="text-sm text-[#605A57] mb-1">Amount</p>
                    <p className="text-2xl font-bold text-[#37322F]">₹{currentBooking.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#605A57] mb-1">Payment Status</p>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      {currentBooking.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Integration Info */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#37322F] mb-2">WhatsApp Communication</h4>
                    <p className="text-sm text-[#605A57] mb-3">
                      Our doctor will contact you via WhatsApp video call at your scheduled time. 
                      You'll receive a confirmation message on WhatsApp shortly.
                    </p>
                    <button
                      onClick={openWhatsApp}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Open WhatsApp Chat
                    </button>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-[#37322F] mb-3">Important Information</h4>
                <ul className="space-y-2 text-sm text-[#605A57]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Keep your Booking ID safe for reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Ensure WhatsApp is installed on your device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Be available 5 minutes before scheduled time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Free follow-up available for 3 days via WhatsApp chat</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={downloadReceipt}
                  className="flex-1 py-3 border border-[rgba(55,50,47,0.2)] text-[#37322F] rounded-lg font-medium hover:bg-[#F7F5F3] transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Download Receipt
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <h3 className="text-2xl font-bold text-[#37322F] mb-6">Book Doctor Consultation</h3>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                    placeholder="Enter your phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">Health Concern</label>
                  <textarea
                    required
                    value={formData.concern}
                    onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] h-24"
                    placeholder="Describe your health concern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2">Preferred Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(55,50,47,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 py-3 border border-[rgba(55,50,47,0.2)] text-[#37322F] rounded-lg font-medium hover:bg-[#F7F5F3] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition-colors"
                  >
                    Submit Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
