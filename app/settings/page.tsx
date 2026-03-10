'use client'

import { useState, useEffect } from 'react'
import { trackReferralShare, trackEmailSignup } from '../../lib/ga4'
import DeliveryTimeOptimizer from '../../components/DeliveryTimeOptimizer'

interface ReferralStats {
  code: string
  url: string
  stats: {
    views: number
    clicks: number
    signups: number
    conversions: number
    conversionRate: string
  }
  rewards: {
    balance: number
    claimed: number
    available: number
  }
}

export default function SettingsPage() {
  const [copied, setCopied] = useState(false)
  const [userName, setUserName] = useState('User')
  const [email, setEmail] = useState('user@example.com')
  const [timezone, setTimezone] = useState('America/Denver')
  const [emailFrequency, setEmailFrequency] = useState('daily')
  const [emailTime, setEmailTime] = useState('08:00')
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)
  const [loadingReferral, setLoadingReferral] = useState(false)

  // Load referral code on mount
  useEffect(() => {
    loadReferralCode()
  }, [])

  const loadReferralCode = async () => {
    setLoadingReferral(true)
    try {
      // First, generate/get referral code
      const genResponse = await fetch('/api/referral/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-demo', email }),
      })

      if (genResponse.ok) {
        // Then fetch stats
        const statsResponse = await fetch('/api/referral/stats?userId=user-demo')
        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          setReferralStats(stats)
        }
      }
    } catch (error) {
      console.error('Failed to load referral code:', error)
    } finally {
      setLoadingReferral(false)
    }
  }

  const referralUrl = referralStats?.url || `https://bbm-app.vercel.app?ref=BBM-DEMO`

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    trackReferralShare()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareVia = (platform: string) => {
    const message = `Check out Big Brain Moves - personalized daily newsletters! Get a free month with my referral link: ${referralUrl}`
    
    let shareUrl = ''
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
    } else if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    } else if (platform === 'email') {
      shareUrl = `mailto:?subject=Check out Big Brain Moves&body=${encodeURIComponent(message)}`
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank')
      trackReferralShare()
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to database
    alert('Profile saved! (Persistence coming soon)')
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button className="px-4 py-2 border-b-2 border-blue-400 text-blue-400 font-medium">
          ⚙️ Profile
        </button>
        <button className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition">
          🔔 Notifications
        </button>
        <button className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium transition">
          🔐 Privacy
        </button>
      </div>

      {/* Profile Section */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Full Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            placeholder="your@email.com"
          />
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          >
            <option>America/Denver</option>
            <option>America/Chicago</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
            <option>Europe/Paris</option>
            <option>Asia/Tokyo</option>
            <option>Australia/Sydney</option>
          </select>
        </div>

        {/* Email Frequency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Newsletter Frequency</label>
          <div className="flex gap-4">
            {['daily', 'weekly', 'biweekly'].map((freq) => (
              <label key={freq} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={emailFrequency === freq}
                  onChange={(e) => setEmailFrequency(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-slate-300 capitalize">{freq}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition"
        >
          💾 Save Profile
        </button>
      </form>

      {/* Divider */}
      <div className="border-t border-slate-800 pt-8" />

      {/* Delivery Time Optimization */}
      <DeliveryTimeOptimizer
        initialTime={emailTime}
      />

      {/* Referral Program */}
      <div className="space-y-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/30 rounded-lg p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">🎁 Earn Rewards</h2>
          <p className="text-slate-400">Refer friends and get 1 free month for every 2 people who sign up</p>
        </div>

        {/* Referral Stats */}
        {loadingReferral ? (
          <div className="text-center py-4 text-slate-400">Loading referral data...</div>
        ) : referralStats ? (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Code</p>
              <p className="text-xl font-bold text-purple-300 mt-1 font-mono">{referralStats.code}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Conversions</p>
              <p className="text-xl font-bold text-pink-300 mt-1">{referralStats.stats.conversions}</p>
              <p className="text-xs text-slate-500 mt-1">{referralStats.stats.signups} signups</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Rewards Earned</p>
              <p className="text-xl font-bold text-green-300 mt-1">{referralStats.rewards.balance} months</p>
              <p className="text-xs text-slate-500 mt-1">{referralStats.rewards.available} available</p>
            </div>
          </div>
        ) : null}

        {/* Referral URL */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Your Referral Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm"
            />
            <button
              onClick={handleCopyReferralLink}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
              }`}
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-300">Share your referral link:</p>
          <div className="grid md:grid-cols-3 gap-3">
            <button
              onClick={() => handleShareVia('twitter')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-100 transition"
            >
              𝕏 Tweet
            </button>
            <button
              onClick={() => handleShareVia('whatsapp')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-100 transition"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={() => handleShareVia('email')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-100 transition"
            >
              📧 Email
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-3 bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-300">How it works:</p>
          <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
            <li>Share your unique referral link</li>
            <li>When a friend signs up with your code, they get 2 weeks free</li>
            <li>When they upgrade to Pro or Premium, you get 1 month free</li>
            <li>No limits — earn as many rewards as you want!</li>
          </ol>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3 border-t border-slate-800 pt-8">
        <p className="text-sm font-medium text-slate-300">Account Actions</p>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-300 transition text-sm">
            🔄 Change Password
          </button>
          <button className="w-full px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-300 transition text-sm">
            📥 Download My Data
          </button>
          <button className="w-full px-4 py-2 border border-red-700/30 hover:bg-red-900/20 rounded-lg text-red-300 transition text-sm">
            ❌ Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
