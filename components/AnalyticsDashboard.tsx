'use client'

import { useState, useEffect } from 'react'
import { trackAnalyticsDashboardView } from '@/lib/ga4'

interface Analytics {
  kpis: Record<string, any>
  topics: any[]
  engagementTrend: any[]
  revenue: any
  referrals: any
  behavior: any
  devices: any
  browsers: any
  period: any
}

interface AnalyticsDashboardProps {
  userId?: string
  period?: number
}

export default function AnalyticsDashboard({
  userId = 'user-demo',
  period = 30,
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [selectedPeriod])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/analytics?userId=${userId}&period=${selectedPeriod}`
      )

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
        trackAnalyticsDashboardView()
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="text-center py-8 text-slate-400">
        Loading analytics...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Analytics</h1>
            <p className="text-slate-400 mt-2">
              Your performance from {analytics.period.startDate} to {analytics.period.endDate}
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {[7, 30, 90].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedPeriod === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {p}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <KPICard
          label="Total Newsletters"
          value={analytics.kpis.totalNewsletters}
          icon="📰"
          trend="+12%"
        />
        <KPICard
          label="Avg Open Rate"
          value={`${analytics.kpis.avgOpenRate}%`}
          icon="📖"
          trend="+5.2%"
        />
        <KPICard
          label="MRR"
          value={`$${analytics.kpis.monthlyRecurringRevenue}`}
          icon="💰"
          trend="+8.5%"
          highlight
        />
        <KPICard
          label="Referral Rate"
          value={`${analytics.referrals.conversionRate}%`}
          icon="👥"
          trend="+3.1%"
        />
      </div>

      {/* Topic Performance */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Topic Performance</h2>
        <div className="grid gap-4">
          {analytics.topics.map((topic, idx) => (
            <TopicCard key={idx} topic={topic} />
          ))}
        </div>
      </div>

      {/* Engagement Trend */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Engagement Trend</h2>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
          {analytics.engagementTrend.map((week, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-300">{week.week}</span>
                <span className="text-sm text-slate-400">
                  {week.opens} opens • {week.clicks} clicks
                </span>
              </div>
              <div className="flex gap-2 h-8">
                <div className="flex-1 bg-slate-800 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(week.opens / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue & Referrals */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Revenue</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="text-center py-4">
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-4xl font-bold text-green-400 mt-2">
                ${analytics.revenue.total}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              {Object.entries(analytics.revenue.byPlan).map(([plan, data]: any) => (
                <div key={plan} className="flex items-center justify-between">
                  <span className="capitalize text-slate-300">{plan}</span>
                  <div className="text-right">
                    <p className="font-semibold">${data.revenue.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{data.count} subscriber(s)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Referrals */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Referral Performance</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded p-3">
                <p className="text-xs text-slate-400">Total Referred</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {analytics.referrals.totalReferred}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <p className="text-xs text-slate-400">Conversions</p>
                <p className="text-2xl font-bold text-pink-400 mt-1">
                  {analytics.referrals.conversions}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <p className="text-sm text-slate-300">
                <strong>Reward Balance:</strong> {analytics.referrals.rewardBalance} months free
              </p>
              <p className="text-sm text-slate-400">
                {analytics.referrals.topReferrer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device & Browser Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Devices</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-3">
            {Object.entries(analytics.devices).map(([device, count]: any) => (
              <div key={device}>
                <div className="flex items-center justify-between mb-1">
                  <span className="capitalize text-slate-300">{device}</span>
                  <span className="text-sm font-semibold">
                    {((count / (analytics.devices.mobile + analytics.devices.desktop + analytics.devices.tablet)) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${((count / (analytics.devices.mobile + analytics.devices.desktop + analytics.devices.tablet)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Browsers</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-3">
            {analytics.browsers.map((browser: any) => (
              <div key={browser.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">{browser.name}</span>
                  <span className="text-sm font-semibold">{browser.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{
                      width: `${browser.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Behavior */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">User Behavior</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-2">
            <p className="text-sm text-slate-400">Total Sessions</p>
            <p className="text-3xl font-bold text-slate-100">{analytics.behavior.totalSessions}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-2">
            <p className="text-sm text-slate-400">Avg Session Duration</p>
            <p className="text-3xl font-bold text-slate-100">{analytics.behavior.avgSessionDuration}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-2">
            <p className="text-sm text-slate-400">Returning Rate</p>
            <p className="text-3xl font-bold text-green-400">{analytics.behavior.returningRate}%</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-2">
            <p className="text-sm text-slate-400">Churn Risk</p>
            <p className="text-3xl font-bold text-green-400">{analytics.behavior.churnRisk}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function KPICard({
  label,
  value,
  icon,
  trend,
  highlight = false,
}: {
  label: string
  value: any
  icon: string
  trend: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg p-6 space-y-2 ${
        highlight
          ? 'bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-700/30'
          : 'bg-slate-900/50 border border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-3xl font-bold text-slate-100 mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-xs text-green-400 font-semibold">{trend} from last period</p>
    </div>
  )
}

function TopicCard({ topic }: { topic: any }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-100">{topic.name}</h3>
          <p className="text-xs text-slate-400 mt-1">
            ⭐ {topic.rating}/5.0 • {topic.emails} emails sent
          </p>
        </div>
        <span className="text-xl">📊</span>
      </div>

      <div className="grid grid-cols-4 gap-3 text-sm">
        <div className="bg-slate-800/50 rounded p-2">
          <p className="text-slate-400 text-xs">Opens</p>
          <p className="font-bold text-slate-100 mt-1">{topic.opens}</p>
          <p className="text-xs text-slate-500">{topic.openRate}%</p>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <p className="text-slate-400 text-xs">Clicks</p>
          <p className="font-bold text-slate-100 mt-1">{topic.clicks}</p>
          <p className="text-xs text-slate-500">{topic.clickRate}%</p>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <p className="text-slate-400 text-xs">Saves</p>
          <p className="font-bold text-slate-100 mt-1">{topic.saves}</p>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <p className="text-slate-400 text-xs">Shares</p>
          <p className="font-bold text-slate-100 mt-1">{topic.shares}</p>
        </div>
      </div>
    </div>
  )
}
