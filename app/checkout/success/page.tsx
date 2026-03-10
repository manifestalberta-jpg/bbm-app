'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { trackReferralConversion, getReferralCodeFromUrl, getStoredReferralCode } from '@/lib/referral'

function SuccessContent() {
  useEffect(() => {
    // Track referral conversion if applicable
    const referralCode = getReferralCodeFromUrl() || getStoredReferralCode()
    if (referralCode) {
      // Get user email from checkout session (TODO: implement proper session handling)
      const email = 'user@example.com'
      trackReferralConversion(referralCode, email)
    }
  }, [])

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="text-6xl">🎉</div>
        <h1 className="text-4xl font-bold">Payment Successful!</h1>
        <p className="text-xl text-slate-400">Welcome to Big Brain Moves Premium</p>
      </div>

      {/* Confirmation Box */}
      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-green-300">✅ Your subscription is active</h2>
        
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong>What happens next:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-400">
            <li>Check your email for a confirmation receipt</li>
            <li>Your premium features are now available</li>
            <li>Your first premium newsletter will arrive tomorrow</li>
            <li>You can manage your subscription anytime in settings</li>
          </ol>
        </div>
      </div>

      {/* Features Unlocked */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">🚀 You Now Have Access To:</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'All 11 topics',
            'PDF + image generation',
            'Email scheduling',
            'AI recommendations',
            'Custom delivery times',
            'Advanced analytics',
            '24/7 priority support',
            'Early feature access',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
              <span>✨</span>
              <span className="text-slate-200">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-3">
        <p className="text-slate-400">Ready to customize your newsletter?</p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition"
          >
            🏠 Go to Dashboard
          </Link>
          <Link
            href="/settings"
            className="px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-lg font-medium transition"
          >
            ⚙️ Manage Plan
          </Link>
        </div>
      </div>

      {/* Support */}
      <div className="bg-slate-800/30 rounded-lg p-4 text-sm text-slate-300">
        <p>Questions? Email us at support@bigbrainmoves.com or visit our help center.</p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
