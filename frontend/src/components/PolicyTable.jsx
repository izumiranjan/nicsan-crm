import { Trash2, ExternalLink } from "lucide-react"

const statusColors = {
  active: { bg: "#ecfdf5", color: "#059669" },
  expired: { bg: "#fef2f2", color: "#dc2626" },
  pending: { bg: "#fffbeb", color: "#d97706" },
  cancelled: { bg: "#f3f4f6", color: "#6b7280" },
}

export default function PolicyTable({ policies, loading, onStatusChange, onDelete }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (policies.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-medium">No policies found</p>
        <p className="text-gray-400 text-sm mt-1">Upload a PDF to get started</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {["Policy", "Customer", "Vehicle", "Insurer", "Premium", "Status", "Actions"].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {policies.map(policy => {
            const s = statusColors[policy.status] || statusColors.pending
            return (
              <tr key={policy.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-4 font-mono text-sm font-medium text-blue-600">{policy.policy_number}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-800 text-sm">{policy.customer_name}</p>
                  <p className="text-xs text-gray-400">{policy.customer_email}</p>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{policy.vehicle_number}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{policy.insurer}</td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-800">Rs.{Number(policy.premium).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4">
                  <select value={policy.status} onChange={e => onStatusChange(policy.id, e.target.value)}
                    className="pl-3 pr-6 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer focus:outline-none"
                    style={{ background: s.bg, color: s.color }}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {policy.s3_file_url && (
                      <a href={policy.s3_file_url} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => onDelete(policy.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
