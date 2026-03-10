'use client'

import { useState, useEffect } from 'react'
import { trackDeliveryTimeView, trackDeliveryTimeApply, trackDeliveryTimeDismiss } from '@/lib/ga4'

interface Optimization {
  currentTime: string
  suggestedTime: string
  optimalHour: number
  confidence: number
  reason: string
  avgOpenRate: number
  peakDays: string[]
}

interface DeliveryTimeOptimizerProps {
  userId?: string
  initialTime?: string
}

export default function DeliveryTimeOptimizer({
  userId = 'user-demo',
  initialTime = '08:00',
}: DeliveryTimeOptimizerProps) {
  const [optimization, setOptimization] = useState<Optimization | null>(null)
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [customTime, setCustomTime] = useState(initialTime)

  // Load optimization on mount
  useEffect(() => {
    loadOptimization()
  }, [])

  const loadOptimization = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/delivery-time?userId=${userId}&currentTime=${initialTime}`
      )

      if (response.ok) {
        const data = await response.json()
        setOptimization(data.optimization)
        trackDeliveryTimeView(initialTime, data.optimization.suggestedTime)
      }
    } catch (error) {
      console.error('Failed to load optimization:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    try {
      const response = await fetch('/api/delivery-time/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          newTime: customTime,
        }),
      })

      if (response.ok) {
        setAccepted(true)
        trackDeliveryTimeApply(customTime)
        setTimeout(() => setAccepted(false), 3000)
      }
    } catch (error) {
      console.error('Failed to apply time:', error)
    }
  }

  const handleDismiss = () => {
    trackDeliveryTimeDismiss()
    setOptimization(null)
  }

  if (!optimization) {
    return null
  }

  const isImprovement = optimization.suggestedTime !== optimization.currentTime
  const timeDiff = optimization.optimalHour - parseInt(optimization.currentTime.split(':')[0])

  return (
    <div className="space-y-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-700/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h3 className="text-lg font-semibold text-blue-300">
            ⏰ Smart Delivery Time
          </h3>
          <p className="text-sm text-slate-400">AI suggests best time to send based on your reading habits</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-500 hover:text-slate-300 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Current vs Suggested */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Current Time */}
        <div className="bg-slate-800/40 rounded-lg p-4 space-y-2">
          <p className="text-xs text-slate-400">Current Send Time</p>
          <p className="text-3xl font-bold text-slate-300">{optimization.currentTime}</p>
          <p className="text-xs text-slate-500">Your current preference</p>
        </div>

        {/* Suggested Time */}
        <div className={`rounded-lg p-4 space-y-2 ${
          isImprovement
            ? 'bg-green-900/30 border border-green-700/50'
            : 'bg-slate-800/40'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">AI Suggestion</p>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              optimization.confidence > 70
                ? 'bg-green-600 text-white'
                : optimization.confidence > 40
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-600 text-white'
            }`}>
              {optimization.confidence}% confident
            </span>
          </div>
          <p className="text-3xl font-bold text-cyan-300">{optimization.suggestedTime}</p>
          <p className="text-xs text-slate-500">
            {timeDiff > 0 ? '+' : ''}{timeDiff} hour{Math.abs(timeDiff) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-slate-800/30 rounded-lg p-3 text-sm text-slate-300 border border-slate-700">
        <p className="font-medium mb-1">Why?</p>
        <p>{optimization.reason}</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-3 text-sm">
        <div className="bg-slate-800/30 rounded p-3">
          <p className="text-slate-400 text-xs">Avg Open Rate</p>
          <p className="text-lg font-bold text-slate-100 mt-1">
            {optimization.avgOpenRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-slate-800/30 rounded p-3">
          <p className="text-slate-400 text-xs">Optimal Hour</p>
          <p className="text-lg font-bold text-slate-100 mt-1">
            {optimization.optimalHour}:00
          </p>
        </div>
        <div className="bg-slate-800/30 rounded p-3">
          <p className="text-slate-400 text-xs">Best Days</p>
          <p className="text-lg font-bold text-slate-100 mt-1">
            {optimization.peakDays.slice(0, 2).join(', ')}
          </p>
        </div>
      </div>

      {/* Custom Time Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Or choose your own time:
        </label>
        <div className="flex gap-2">
          <input
            type="time"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          <button
            onClick={handleApply}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              accepted
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
          >
            {accepted ? '✅ Applied' : '✓ Apply'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-slate-500 px-1">
        💡 We'll send your newsletter at this time each day. Adjust anytime in settings.
      </div>
    </div>
  )
}
