import AnalyticsDashboard from '../../components/AnalyticsDashboard'

export const metadata = {
  title: 'Analytics - Big Brain Moves',
  description: 'View your newsletter performance, engagement metrics, and revenue analytics',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header Navigation */}
      <div className="flex gap-4 border-b border-slate-800 pb-4">
        <a
          href="/"
          className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition"
        >
          📰 Dashboard
        </a>
        <a
          href="/manage-plan"
          className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition"
        >
          💳 Manage Plan
        </a>
        <a
          href="/analytics"
          className="px-4 py-2 border-b-2 border-blue-400 text-blue-400 font-medium"
        >
          📊 Analytics
        </a>
        <a
          href="/settings"
          className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition"
        >
          ⚙️ Settings
        </a>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  )
}
