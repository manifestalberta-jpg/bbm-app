'use client'

import { trackTopicSelected } from '../lib/ga4'

interface TopicSelectorProps {
  availableTopics: string[]
  selectedTopics: string[]
  onToggle: (topic: string) => void
}

export default function TopicSelector({
  availableTopics,
  selectedTopics,
  onToggle,
}: TopicSelectorProps) {
  
  const handleTopicClick = (topic: string) => {
    onToggle(topic)
    trackTopicSelected(topic)
  }
  const topicEmojis: Record<string, string> = {
    Dieting: '🥗',
    Budgeting: '💰',
    'Date Ideas': '💕',
    'Building Attraction': '✨',
    'Relationship Counselling': '💬',
    'New Careers': '🚀',
    'Music & Concerts': '🎵',
    'Vacation Planning': '✈️',
    Experiences: '🎭',
    'Time Management': '⏰',
    'Deal Hunting': '🎯',
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-slate-300">Select Topics</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableTopics.map(topic => (
          <button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className={`p-3 rounded-lg border-2 transition font-medium text-sm ${
              selectedTopics.includes(topic)
                ? 'border-blue-400 bg-blue-400/10 text-blue-300'
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <span className="mr-2">{topicEmojis[topic] || '📌'}</span>
            {topic}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs text-slate-500">
          Selected: {selectedTopics.length} topics
        </p>
        <p className="text-xs text-slate-500 italic">
          💡 Popular combo: Dieting + Deal Hunting + Time Management (987 users)
        </p>
      </div>
    </div>
  )
}
