"use client"

import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs"
import {
  FileText,
  Upload,
  TrendingUp,
  Activity,
  Play,
  Download,
  Lock,
  BarChart3,
  Heart,
  CheckCircle,
  Clock,
  Sparkles,
  Home,
  Settings,
  FolderOpen,
  Eye,
  Filter,
  X,
  Crown,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { HealthReport } from "@/lib/supabase"
import { Navbar } from "@/components/navbar"
import { ReportChatbot } from "@/components/report-chatbot"

interface Subscription {
  plan: string
  status: string
  end_date?: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const [reports, setReports] = useState<HealthReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFamily, setSelectedFamily] = useState<string>("All")
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    if (user) {
      fetchReports()
      fetchSubscription()
    }
  }, [user])

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/status")
      const data = await response.json()
      if (data.success && data.subscription) {
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    }
  }

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/get-reports")
      const data = await response.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const familyMembers = ["All", ...new Set(reports.map((r) => r.family_member_name))]
  const filteredReports =
    selectedFamily === "All" ? reports : reports.filter((r) => r.family_member_name === selectedFamily)

  const stats = {
    total: reports.length,
    analyzed: reports.length,
    pending: 0,
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F5F3] pt-20">
        <SignedOut>
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-[#37322F] mb-4">Please Sign In</h1>
            <p className="text-[#605A57] text-lg">You need to be signed in to access your dashboard.</p>
          </div>
        </SignedOut>

        <SignedIn>
        <div className="relative flex flex-col justify-start items-center w-full">
          {/* Main container with vertical lines */}
          <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1400px] lg:w-[1400px] relative flex min-h-screen py-8">
            {/* Left vertical line */}
            <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

            {/* Right vertical line */}
            <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

            {/* Sidebar Navigation */}
            <aside className="hidden lg:block w-64 flex-shrink-0 pr-8 relative z-10">
              <div className="sticky top-24 space-y-2">
                <SidebarLink icon={Home} label="Dashboard" href="/dashboard" active />
                <SidebarLink icon={Upload} label="Upload Report" href="/" />
                <SidebarLink icon={BarChart3} label="Insights" href="/dashboard#insights" />
                <SidebarLink icon={FolderOpen} label="Health Vault" href="/dashboard#vault" />
                <SidebarLink icon={Settings} label="Settings" href="/dashboard#settings" />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
              {/* Header Area */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold text-[#37322F] font-serif">
                        Welcome back, {user?.firstName || "User"}
                      </h1>
                      {subscription && subscription.status === "approved" && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
                          <Crown className="w-5 h-5 text-white" />
                          <span className="text-white font-semibold text-sm capitalize">{subscription.plan} Member</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[#605A57] text-lg">Track your health journey with AI insights.</p>
                    {subscription && subscription.status === "approved" && subscription.end_date && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-[#605A57]">
                        <Calendar className="w-4 h-4" />
                        <span>Valid until {new Date(subscription.end_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="lg:hidden">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <QuickStatCard
                  icon={FileText}
                  title="Total Reports"
                  value={stats.total.toString()}
                  subtitle="All time"
                  color="blue"
                />
                <QuickStatCard
                  icon={CheckCircle}
                  title="Analyzed"
                  value={stats.analyzed.toString()}
                  subtitle="Ready to view"
                  color="green"
                />
                <QuickStatCard
                  icon={Clock}
                  title="Pending"
                  value={stats.pending.toString()}
                  subtitle="Processing"
                  color="orange"
                />
              </div>

              {/* Reports Overview */}
              <div id="vault" className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6 md:p-8 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-[#37322F] font-serif">📂 Your Lab Reports</h2>
                  <div className="flex items-center gap-3">
                    {/* Family Filter */}
                    {familyMembers.length > 1 && (
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#605A57]" />
                        <select
                          value={selectedFamily}
                          onChange={(e) => setSelectedFamily(e.target.value)}
                          className="px-3 py-2 border border-[#37322F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                        >
                          {familyMembers.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#37322F]/90 transition text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload New
                    </Link>
                  </div>
                </div>

                {/* Reports Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-[#37322F] border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-[#605A57] mt-4">Loading reports...</p>
                    </div>
                  ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-[#605A57]/40 mx-auto mb-3" />
                      <p className="text-[#605A57] mb-4">
                        {selectedFamily === "All" ? "No reports uploaded yet" : `No reports for ${selectedFamily}`}
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#37322F]/90 transition"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Your First Report
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#37322F]/10">
                          <th className="text-left py-3 px-4 text-[#37322F] font-semibold text-sm">Report Name</th>
                          <th className="text-left py-3 px-4 text-[#37322F] font-semibold text-sm">Family Member</th>
                          <th className="text-left py-3 px-4 text-[#37322F] font-semibold text-sm">Date</th>
                          <th className="text-left py-3 px-4 text-[#37322F] font-semibold text-sm">Status</th>
                          <th className="text-left py-3 px-4 text-[#37322F] font-semibold text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map((report) => (
                          <tr key={report.id} className="border-b border-[#37322F]/5 hover:bg-white/40">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#605A57]" />
                                <span className="text-[#37322F] font-medium text-sm">{report.file_name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                {report.family_member_name}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-[#605A57] text-sm">
                              {new Date(report.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Analyzed
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => setSelectedReport(report)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#37322F] text-white rounded-lg text-sm hover:bg-[#37322F]/90 transition"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div id="insights" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Health Insights Section */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-[#37322F] mb-6 font-serif flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    📊 Health Insights
                  </h2>
                  <div className="space-y-4">
                    <InsightCard
                      icon="💚"
                      text="Upload your first report to get personalized AI insights"
                      type="info"
                    />
                    <InsightCard
                      icon="📈"
                      text="Track your health trends over time with our analytics"
                      type="info"
                    />
                  </div>
                </div>

                {/* Health Record Vault */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-[#37322F] mb-6 font-serif flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    🔐 Health Record Vault
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-[#37322F]/10">
                      <span className="text-[#605A57]">Total Reports</span>
                      <span className="text-[#37322F] font-bold">{reports.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#37322F]/10">
                      <span className="text-[#605A57]">Family Members</span>
                      <span className="text-[#37322F] font-bold">{familyMembers.length - 1}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#37322F]/10">
                      <span className="text-[#605A57]">Storage Used</span>
                      <span className="text-[#37322F] font-bold">
                        {(reports.reduce((acc, r) => acc + r.file_size, 0) / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    
                    {/* Family Members List */}
                    {familyMembers.length > 1 && (
                      <div className="mt-4 pt-4 border-t border-[#37322F]/10">
                        <p className="text-sm font-medium text-[#37322F] mb-3">Reports by Family Member:</p>
                        <div className="space-y-2">
                          {familyMembers.filter(m => m !== "All").map((member) => {
                            const count = reports.filter(r => r.family_member_name === member).length
                            return (
                              <div key={member} className="flex items-center justify-between text-sm">
                                <span className="text-[#605A57]">{member}</span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                  {count} {count === 1 ? 'report' : 'reports'}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#37322F]/20 text-[#37322F] rounded-lg font-medium hover:bg-[#37322F]/5 transition">
                      <Download className="w-4 h-4" />
                      Download All Reports
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Explainer Videos */}
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#37322F] mb-6 font-serif">🎥 Recent Explainer Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <VideoCard
                    title="Complete Blood Count"
                    date="No videos yet"
                    duration=""
                    thumbnail="🩸"
                  />
                  <VideoCard title="Thyroid Profile" date="Upload reports" duration="" thumbnail="🧬" />
                  <VideoCard
                    title="Lipid Panel"
                    date="to generate videos"
                    duration=""
                    thumbnail="💊"
                  />
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Report View Modal with Side Chat */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm">
            {/* Report Panel */}
            <div className={`flex-1 flex items-center justify-center p-4 transition-all duration-300 ${isChatOpen ? 'mr-[500px]' : ''}`}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#37322F]/10">
                  <div>
                    <h2 className="text-2xl font-bold text-[#37322F] font-serif">
                      {selectedReport.file_name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {selectedReport.family_member_name}
                      </span>
                      <span className="text-[#605A57] text-sm">
                        {new Date(selectedReport.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-[#605A57] text-sm">
                        {(selectedReport.file_size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReport(null)
                      setIsChatOpen(false)
                    }}
                    className="p-2 hover:bg-[#37322F]/5 rounded-full transition"
                  >
                    <X className="w-6 h-6 text-[#605A57]" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose prose-lg max-w-none">
                    <div
                      className="text-[#37322F]"
                      dangerouslySetInnerHTML={{
                        __html: selectedReport.analysis
                          .replace(/\n/g, "<br/>")
                          .replace(/## (.*?)(<br\/>|$)/g, '<h2 class="text-2xl font-bold text-[#37322F] mt-6 mb-4">$1</h2>')
                          .replace(/### (.*?)(<br\/>|$)/g, '<h3 class="text-xl font-bold text-[#37322F] mt-4 mb-3">$1</h3>')
                          .replace(/#### (.*?)(<br\/>|$)/g, '<h4 class="text-lg font-semibold text-[#37322F] mt-3 mb-2">$1</h4>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#37322F]">$1</strong>')
                          .replace(/- (.*?)(<br\/>|$)/g, '<li class="ml-4">$1</li>')
                      }}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-6 border-t border-[#37322F]/10 bg-[#F7F5F3]">
                  <div className="flex items-center gap-2 text-sm text-[#605A57]">
                    <FileText className="w-4 h-4" />
                    <span>AI-Generated Analysis</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#37322F]/90 transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isChatOpen ? 'Hide Chat' : 'Chat to AI'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#37322F]/20 text-[#37322F] rounded-lg font-medium hover:bg-[#37322F]/5 transition">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReport(null)
                        setIsChatOpen(false)
                      }}
                      className="px-6 py-2 bg-white border border-[#37322F]/20 text-[#37322F] rounded-lg font-medium hover:bg-[#37322F]/5 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Chat Panel */}
            <ReportChatbot
              analysis={selectedReport.analysis}
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              position="side"
            />
          </div>
        )}
        </SignedIn>
      </div>
    </>
  )
}

function SidebarLink({
  icon: Icon,
  label,
  href,
  active = false,
}: {
  icon: any
  label: string
  href: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active ? "bg-[#37322F] text-white shadow-lg" : "text-[#605A57] hover:bg-white/60"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  )
}

function QuickStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: any
  title: string
  value: string
  subtitle: string
  color: string
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl p-6">
      <div
        className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-[#605A57] text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-[#37322F] mb-1">{value}</p>
      <p className="text-[#605A57] text-xs">{subtitle}</p>
    </div>
  )
}

function InsightCard({ icon, text, type }: { icon: string; text: string; type: "info" | "warning" | "success" }) {
  const bgColors = {
    info: "bg-blue-50 border-blue-200",
    warning: "bg-orange-50 border-orange-200",
    success: "bg-green-50 border-green-200",
  }

  return (
    <div className={`${bgColors[type]} border rounded-xl p-4 flex items-start gap-3`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-[#37322F] text-sm leading-relaxed">{text}</p>
    </div>
  )
}

function VideoCard({
  title,
  date,
  duration,
  thumbnail,
}: {
  title: string
  date: string
  duration: string
  thumbnail: string
}) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 overflow-hidden hover:shadow-lg transition">
      <div className="aspect-video bg-gradient-to-br from-[#37322F]/10 to-[#37322F]/5 flex items-center justify-center relative group">
        <span className="text-6xl">{thumbnail}</span>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-[#37322F] ml-1" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[#37322F] font-semibold mb-1">{title}</h3>
        <p className="text-[#605A57] text-sm">{date}</p>
        {duration && <p className="text-[#605A57] text-xs mt-1">{duration}</p>}
      </div>
    </div>
  )
}
