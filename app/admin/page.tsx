"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { SubscriptionsTab } from "@/components/admin-subscriptions-tab"
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Search,
  Filter,
  Crown,
} from "lucide-react"
import { redirect } from "next/navigation"

interface AdminStats {
  totalUsers: number
  totalReports: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  completedBookings: number
}

interface UserData {
  id: string
  email: string
  name: string
  createdAt: string
  lastSignIn: string
  reportsCount: number
  bookingsCount: number
}

interface ReportData {
  id: string
  user_id: string
  file_name: string
  file_size: number
  family_member_name: string
  created_at: string
  status: string
}

interface BookingData {
  id: string
  booking_id: string
  name: string
  phone: string
  email: string
  concern: string
  preferred_time: string
  status: string
  payment_status: string
  amount: number
  created_at: string
}

interface SubscriptionData {
  id: string
  user_id: string
  user_email: string
  user_name: string
  plan: string
  amount: number
  transaction_id: string
  upi_id: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [reports, setReports] = useState<ReportData[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "bookings" | "subscriptions">("overview")

  const ADMIN_EMAIL = "khnnabubakar786@gmail.com"

  useEffect(() => {
    if (isLoaded && user) {
      const userEmail = user.emailAddresses[0]?.emailAddress
      if (userEmail !== ADMIN_EMAIL) {
        redirect("/")
      } else {
        fetchAdminData()
      }
    }
  }, [isLoaded, user])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, reportsRes, bookingsRes, subscriptionsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/admin/reports"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/subscriptions"),
      ])

      const [statsData, usersData, reportsData, bookingsData, subscriptionsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        reportsRes.json(),
        bookingsRes.json(),
        subscriptionsRes.json(),
      ])

      if (statsData.success) setStats(statsData.stats)
      if (usersData.success) setUsers(usersData.users)
      if (reportsData.success) setReports(reportsData.reports)
      if (bookingsData.success) setBookings(bookingsData.bookings)
      if (subscriptionsData.success) setSubscriptions(subscriptionsData.subscriptions)
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscriptionAction = async (subscriptionId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, action }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Subscription ${action}d successfully!`)
        fetchAdminData() // Refresh data
      } else {
        alert(data.error || `Failed to ${action} subscription`)
      }
    } catch (error) {
      console.error(`Error ${action}ing subscription:`, error)
      alert(`An error occurred while ${action}ing subscription`)
    }
  }

  if (!isLoaded || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F5F3] pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37322F] mx-auto mb-4"></div>
            <p className="text-[#605A57]">Loading admin dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F5F3] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#37322F] mb-2">Admin Dashboard</h1>
            <p className="text-[#605A57]">Welcome back, {user.firstName || "Admin"}</p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                color="blue"
              />
              <StatCard
                icon={FileText}
                title="Total Reports"
                value={stats.totalReports}
                color="green"
              />
              <StatCard
                icon={Calendar}
                title="Total Bookings"
                value={stats.totalBookings}
                color="purple"
              />
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`₹${stats.totalRevenue}`}
                color="orange"
              />
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.08)] mb-6">
            <div className="flex border-b border-[rgba(55,50,47,0.08)]">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                icon={Activity}
                label="Overview"
              />
              <TabButton
                active={activeTab === "users"}
                onClick={() => setActiveTab("users")}
                icon={Users}
                label="Users"
              />
              <TabButton
                active={activeTab === "reports"}
                onClick={() => setActiveTab("reports")}
                icon={FileText}
                label="Reports"
              />
              <TabButton
                active={activeTab === "bookings"}
                onClick={() => setActiveTab("bookings")}
                icon={Calendar}
                label="Bookings"
              />
              <TabButton
                active={activeTab === "subscriptions"}
                onClick={() => setActiveTab("subscriptions")}
                icon={Crown}
                label="Subscriptions"
              />
            </div>

            <div className="p-6">
              {activeTab === "overview" && stats && (
                <OverviewTab stats={stats} bookings={bookings} reports={reports} />
              )}
              {activeTab === "users" && <UsersTab users={users} />}
              {activeTab === "reports" && <ReportsTab reports={reports} />}
              {activeTab === "bookings" && <BookingsTab bookings={bookings} />}
              {activeTab === "subscriptions" && <SubscriptionsTab subscriptions={subscriptions} onAction={handleSubscriptionAction} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({ icon: Icon, title, value, color }: any) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  }

  return (
    <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#37322F] mb-1">{value}</p>
      <p className="text-sm text-[#605A57]">{title}</p>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
        active
          ? "text-[#37322F] border-b-2 border-[#37322F]"
          : "text-[#605A57] hover:text-[#37322F]"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}

function OverviewTab({ stats, bookings, reports }: any) {
  const recentBookings = bookings.slice(0, 5)
  const recentReports = reports.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="font-semibold text-[#37322F]">Pending Bookings</p>
          </div>
          <p className="text-2xl font-bold text-[#37322F]">{stats.pendingBookings}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-[#37322F]">Completed</p>
          </div>
          <p className="text-2xl font-bold text-[#37322F]">{stats.completedBookings}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="font-semibold text-[#37322F]">Growth</p>
          </div>
          <p className="text-2xl font-bold text-[#37322F]">+12%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-[#37322F] mb-4">Recent Bookings</h3>
          <div className="space-y-2">
            {recentBookings.map((booking: BookingData) => (
              <div key={booking.id} className="bg-[#F7F5F3] rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#37322F]">{booking.name}</p>
                    <p className="text-sm text-[#605A57]">{booking.booking_id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    booking.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#37322F] mb-4">Recent Reports</h3>
          <div className="space-y-2">
            {recentReports.map((report: ReportData) => (
              <div key={report.id} className="bg-[#F7F5F3] rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#37322F]">{report.file_name}</p>
                    <p className="text-sm text-[#605A57]">{report.family_member_name}</p>
                  </div>
                  <p className="text-xs text-[#605A57]">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UsersTab({ users }: { users: UserData[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#37322F]">All Users ({users.length})</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#37322F] text-white rounded-lg text-sm hover:bg-[#37322F]/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F5F3]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Reports</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Bookings</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[rgba(55,50,47,0.08)]">
                <td className="px-4 py-3 text-sm text-[#37322F]">{user.name}</td>
                <td className="px-4 py-3 text-sm text-[#605A57]">{user.email}</td>
                <td className="px-4 py-3 text-sm text-[#37322F]">{user.reportsCount}</td>
                <td className="px-4 py-3 text-sm text-[#37322F]">{user.bookingsCount}</td>
                <td className="px-4 py-3 text-sm text-[#605A57]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReportsTab({ reports }: { reports: ReportData[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#37322F]">All Reports ({reports.length})</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#37322F] text-white rounded-lg text-sm hover:bg-[#37322F]/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F5F3]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">File Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Family Member</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Size</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-[rgba(55,50,47,0.08)]">
                <td className="px-4 py-3 text-sm text-[#37322F]">{report.file_name}</td>
                <td className="px-4 py-3 text-sm text-[#605A57]">{report.family_member_name}</td>
                <td className="px-4 py-3 text-sm text-[#605A57]">
                  {(report.file_size / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="px-4 py-3 text-sm text-[#605A57]">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BookingsTab({ bookings }: { bookings: BookingData[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#37322F]">All Bookings ({bookings.length})</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#37322F] text-white rounded-lg text-sm hover:bg-[#37322F]/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F5F3]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Booking ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-[rgba(55,50,47,0.08)]">
                <td className="px-4 py-3 text-sm font-mono text-[#37322F]">{booking.booking_id}</td>
                <td className="px-4 py-3 text-sm text-[#37322F]">{booking.name}</td>
                <td className="px-4 py-3 text-sm text-[#605A57]">{booking.phone}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    booking.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    booking.status === "completed" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.payment_status === "paid" ? "bg-green-100 text-green-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {booking.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#37322F]">₹{booking.amount}</td>
                <td className="px-4 py-3 text-sm text-[#605A57]">
                  {new Date(booking.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
