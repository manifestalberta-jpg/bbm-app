'use client'

import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Cancel Message */}
        <div className="text-center space-y-4">
          <div className="text-6xl">👋</div>
          <h1 className="text-4xl font-bold">Checkout Cancelled</h1>
          <p className="text-xl text-slate-400">No worries — you can always upgrade later</p>
        </div>

        {/* Info Box */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">What happens now?</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span>✓</span>
              <span>You're still on the <strong>Free plan</strong></span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>Your data is safe and still available</span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>You can upgrade anytime</span>
            </li>
          </ul>
        </div>

        {/* Why Upgrade */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Still interested? Here's what you'd unlock:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { emoji: '✨', text: 'All 11 topics' },
              { emoji: '📊', text: 'AI recommendations' },
              { emoji: '🎯', text: 'Custom delivery times' },
              { emoji: '📈', text: 'Advanced analytics' },
              { emoji: '⏰', text: 'Email scheduling' },
              { emoji: '🚀', text: 'Early feature access' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition text-center"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/manage-plan"
              className="flex-1 px-6 py-3 border border-blue-600 hover:bg-blue-600/10 rounded-lg font-medium text-blue-400 transition text-center"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Offer */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg p-6 text-center space-y-3">
          <h3 className="font-semibold">Thinking it over?</h3>
          <p className="text-sm text-slate-400">
            We offer a <strong>30-day money-back guarantee</strong>. Try Pro or Premium risk-free.
          </p>
          <Link
            href="/manage-plan"
            className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition"
          >
            Explore Plans
          </Link>
        </div>

        {/* Support */}
        <div className="text-center text-sm text-slate-400">
          <p>Questions? Email support@bigbrainmoves.com</p>
        </div>
      </div>
    </div>
  )
}
