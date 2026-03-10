'use client';

import { useState } from 'react';
import { TrendingUp, Users, Mail, DollarSign, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const METRICS = [
  {
    label: 'Total Subscribers',
    value: '2,847',
    change: '+12%',
    icon: Users,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    label: 'Emails Sent',
    value: '89,432',
    change: '+8%',
    icon: Mail,
    color: 'from-purple-400 to-pink-500',
  },
  {
    label: 'Open Rate',
    value: '38.2%',
    change: '+3.5%',
    icon: BarChart3,
    color: 'from-green-400 to-emerald-500',
  },
  {
    label: 'MRR',
    value: '$14,238',
    change: '+18%',
    icon: DollarSign,
    color: 'from-amber-400 to-orange-500',
  },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('30d');

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Analytics Dashboard</h1>
          <p className="text-dark-400">Track your newsletter growth and engagement metrics</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 mb-8">
          {['7d', '30d', '90d', 'all'].map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeframe(frame)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === frame
                  ? 'bg-green-500 text-white'
                  : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }`}
            >
              {frame === 'all' ? 'All Time' : frame}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="glass rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-dark-400 text-sm">{metric.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{metric.value}</h3>
                  </div>
                  <div className={`bg-gradient-to-r ${metric.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-green-400 text-sm font-semibold">{metric.change}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Email Performance */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Email Performance</h3>
            <div className="space-y-4">
              {[
                { label: 'Opens', value: 3247, percent: 38 },
                { label: 'Clicks', value: 892, percent: 27 },
                { label: 'Conversions', value: 124, percent: 12 },
                { label: 'Unsubscribes', value: 23, percent: 2 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-dark-300">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Performance */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Topic Performance</h3>
            <div className="space-y-3">
              {[
                { topic: 'Vacation Planning', opens: 1247, engagement: 92 },
                { topic: 'Dieting', opens: 1089, engagement: 85 },
                { topic: 'Deals', opens: 987, engagement: 78 },
                { topic: 'Time Management', opens: 856, engagement: 71 },
              ].map((item) => (
                <div
                  key={item.topic}
                  className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                >
                  <div>
                    <p className="text-white font-semibold">{item.topic}</p>
                    <p className="text-dark-400 text-sm">{item.opens} opens</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{item.engagement}%</p>
                    <p className="text-dark-500 text-xs">engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue & Growth */}
        <div className="glass rounded-xl p-6 mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Revenue Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'MRR', value: '$14,238', trend: '+18%' },
              { label: 'Total Revenue', value: '$47,823', trend: '+24%' },
              { label: 'Avg LTV', value: '$156', trend: '+9%' },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-dark-800 rounded-lg">
                <p className="text-dark-400 text-sm">{item.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{item.value}</p>
                <p className="text-green-400 text-sm mt-2">{item.trend}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp size={24} className="text-green-400" />
            <h3 className="text-xl font-bold text-white">Optimization Recommendations</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Optimal Send Time',
                description: 'Send newsletters at 7:00 PM for +24% higher open rate',
                action: 'Configure',
              },
              {
                title: 'Topic Boost: Vacation Planning',
                description: '92% engagement. Increase frequency to capitalize on interest',
                action: 'Update',
              },
              {
                title: 'Referral Program Growth',
                description: 'Add referral incentives to boost subscriber acquisition by 40%',
                action: 'Launch',
              },
            ].map((rec, i) => (
              <div key={i} className="p-4 bg-dark-800 rounded-lg flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">{rec.title}</p>
                  <p className="text-dark-400 text-sm mt-1">{rec.description}</p>
                </div>
                <button className="text-green-400 hover:text-green-300 font-semibold whitespace-nowrap ml-4">
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
