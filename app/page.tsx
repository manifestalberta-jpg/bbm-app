'use client'

import { useState } from 'react'
import TopicSelector from '../components/TopicSelector'
import PDFViewer from '../components/PDFViewer'
import Timetable from '../components/Timetable'
import PWAInstall from '../components/PWAInstall'
import SocialProof from '../components/SocialProof'
import Recommendations from '../components/Recommendations'

const AVAILABLE_TOPICS = [
  'Dieting',
  'Budgeting',
  'Date Ideas',
  'Building Attraction',
  'Relationship Counselling',
  'New Careers',
  'Music & Concerts',
  'Vacation Planning',
  'Experiences',
  'Time Management',
  'Deal Hunting',
]

export default function Dashboard() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Dieting',
    'Date Ideas',
    'Time Management',
  ])
  const [activeView, setActiveView] = useState<'viewer' | 'timetable'>('viewer')

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  return (
    <div className="space-y-8">
      {/* PWA Install Prompt */}
      <PWAInstall />

      {/* Navigation Bar */}
      <div className="flex gap-4 border-b border-slate-800 pb-4">
        <button className="px-4 py-2 border-b-2 border-blue-400 text-blue-400 font-medium">
          📰 Dashboard
        </button>
        <a
          href="/analytics"
          className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition"
        >
          📊 Analytics
        </a>
        <a
          href="/manage-plan"
          className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition"
        >
          💳 Manage Plan
        </a>
        <a
          href="/settings"
          className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition"
        >
          ⚙️ Settings
        </a>
      </div>

      {/* Header with Social Proof */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Your Daily Newsletter</h2>
          <p className="text-slate-400">Select topics to customize your daily PDF</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <span>⭐⭐⭐⭐⭐</span>
            <span>4.9/5 from 1,200+ users</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>Join 1,000+ daily readers</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Trusted by professionals</span>
          </div>
        </div>
      </div>

      {/* Topic Selector */}
      <TopicSelector
        availableTopics={AVAILABLE_TOPICS}
        selectedTopics={selectedTopics}
        onToggle={toggleTopic}
      />

      {/* Smart Recommendations */}
      <Recommendations
        currentTopics={selectedTopics}
        onAddTopic={toggleTopic}
      />

      {/* View Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveView('viewer')}
          className={`px-4 py-2 font-medium transition ${
            activeView === 'viewer'
              ? 'border-b-2 border-blue-400 text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📄 Daily PDF
        </button>
        <button
          onClick={() => setActiveView('timetable')}
          className={`px-4 py-2 font-medium transition ${
            activeView === 'timetable'
              ? 'border-b-2 border-blue-400 text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⏰ Timetable
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-8">
        {activeView === 'viewer' && (
          <PDFViewer topics={selectedTopics} />
        )}
        {activeView === 'timetable' && (
          <Timetable topics={selectedTopics} />
        )}
      </div>

      {/* Social Proof Section */}
      <SocialProof />
    </div>
  )
}
