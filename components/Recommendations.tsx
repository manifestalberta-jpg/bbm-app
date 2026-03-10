'use client'

import { useState, useEffect } from 'react'
import { trackRecommendationAccept } from '@/lib/ga4'

interface Recommendation {
  topic: string
  explanation: string
  confidence: {
    confidence: number
    label: string
  }
  score: number
  interactions: number
}

interface RecommendationsProps {
  userId?: string
  currentTopics: string[]
  onAddTopic?: (topic: string) => void
}

export default function Recommendations({
  userId = 'user-demo',
  currentTopics,
  onAddTopic,
}: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  // Load recommendations on mount
  useEffect(() => {
    loadRecommendations()
  }, [currentTopics])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const topicsParam = currentTopics.join(',')
      const response = await fetch(
        `/api/recommendations?userId=${userId}&currentTopics=${topicsParam}`
      )

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTopic = (topic: string) => {
    trackRecommendationAccept(topic)
    onAddTopic?.(topic)
    setDismissed(prev => new Set(prev).add(topic))
  }

  const handleDismiss = (topic: string) => {
    setDismissed(prev => new Set(prev).add(topic))
  }

  const visibleRecommendations = recommendations.filter(
    rec => !dismissed.has(rec.topic)
  )

  if (loading) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-4 text-center text-slate-400">
        Loading recommendations...
      </div>
    )
  }

  if (visibleRecommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">💡 Recommended for You</h3>
        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
          {visibleRecommendations.length} new
        </span>
      </div>

      <div className="space-y-3">
        {visibleRecommendations.map(rec => (
          <div
            key={rec.topic}
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-lg p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <h4 className="font-semibold text-slate-100">{rec.topic}</h4>
                <p className="text-sm text-slate-400">{rec.explanation}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-300">
                  {rec.confidence.confidence}%
                </div>
                <div className="text-xs text-slate-500">
                  {rec.confidence.label} match
                </div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  rec.confidence.confidence > 70
                    ? 'bg-green-500'
                    : rec.confidence.confidence > 40
                    ? 'bg-yellow-500'
                    : 'bg-slate-600'
                }`}
                style={{
                  width: `${rec.confidence.confidence}%`,
                }}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-xs text-slate-400">
              <span>{rec.interactions} similar users liked this</span>
              <span>•</span>
              <span>Score: {rec.score}/10</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAddTopic(rec.topic)}
                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded font-medium text-white text-sm transition"
              >
                ✨ Add to Selection
              </button>
              <button
                onClick={() => handleDismiss(rec.topic)}
                className="px-3 py-2 border border-slate-700 hover:bg-slate-800 rounded font-medium text-slate-300 text-sm transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="text-xs text-slate-500 px-1">
        💬 Recommendations based on your reading history and preferences
      </div>
    </div>
  )
}
