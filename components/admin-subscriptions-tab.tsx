import { CheckCircle, XCircle, Clock, Download } from "lucide-react"

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

export function SubscriptionsTab({ 
  subscriptions, 
  onAction 
}: { 
  subscriptions: SubscriptionData[]
  onAction: (id: string, action: "approve" | "reject") => void 
}) {
  const pendingSubscriptions = subscriptions.filter(s => s.status === "pending")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#37322F]">All Subscriptions ({subscriptions.length})</h3>
          <div className="flex gap-4 mt-2">
            <span className="text-sm text-[#605A57]">Pending: <strong>{pendingSubscriptions.length}</strong></span>
          </div>
        </div>
      </div>

      {pendingSubscriptions.length > 0 && (
        <div className="mb-8">
          <h4 className="text-md font-semibold text-[#37322F] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Approval ({pendingSubscriptions.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-[rgba(55,50,47,0.08)] bg-white">
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#37322F] font-medium">{sub.user_name}</div>
                      <div className="text-xs text-[#605A57]">{sub.user_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#37322F] font-semibold">₹{sub.amount}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[#605A57]">{sub.transaction_id}</td>
                    <td className="px-4 py-3 text-sm text-[#605A57]">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAction(sub.id, "approve")}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => onAction(sub.id, "reject")}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-md font-semibold text-[#37322F] mb-4">All Subscriptions</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F5F3]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">User</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Transaction ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#37322F]">Date</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-[rgba(55,50,47,0.08)]">
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#37322F] font-medium">{sub.user_name}</div>
                    <div className="text-xs text-[#605A57]">{sub.user_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#37322F]">₹{sub.amount}</td>
                  <td className="px-4 py-3 text-sm font-mono text-[#605A57]">{sub.transaction_id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sub.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      sub.status === "approved" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#605A57]">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
