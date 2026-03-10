'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { trackSubscription } from '../../lib/ga4'

// Initialize Stripe (loaded once)
let stripePromise: ReturnType<typeof loadStripe> | null = null

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
  }
  return stripePromise
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      '3 topics per week',
      'HTML emails only',
      'Mobile web access',
      'Community support',
    ],
    cta: 'Current Plan',
    ctaStyle: 'secondary',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    features: [
      'All topics available',
      'PDF + image generation',
      'Email scheduling',
      'Priority support',
      'Offline access',
    ],
    cta: 'Upgrade to Pro',
    ctaStyle: 'primary',
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    features: [
      'Everything in Pro',
      'AI-powered recommendations',
      'Custom delivery times',
      'Advanced analytics',
      '24/7 priority support',
      'Early access to features',
    ],
    cta: 'Upgrade to Premium',
    ctaStyle: 'primary',
    recommended: true,
  },
]

export default function ManagePlanPage() {
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'premium'>('free')
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (planId: 'pro' | 'premium') => {
    setLoading(true)
    try {
      // Track upgrade attempt
      trackSubscription(planId)

      // TODO: Integrate with Stripe
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ plan: planId }),
      // })
      // if (response.ok) {
      //   setCurrentPlan(planId)
      //   alert('Upgrade successful!')
      // }

      // Get user email (TODO: get from session/auth)
      const email = 'user@example.com'

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, email }),
      })

      if (response.ok) {
        const { sessionId } = await response.json()

        // Get Stripe instance and redirect to checkout
        const stripe = await getStripe()
        if (!stripe) {
          alert('Stripe failed to load. Please try again.')
          return
        }

        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe redirect failed:', error)
          alert('Checkout failed. Please try again.')
        }
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Social Proof */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Manage Your Plan</h1>
          <p className="text-slate-400">Choose the perfect plan for your newsletter needs</p>
        </div>
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 text-sm text-green-300">
          ✅ <strong>300+ upgrades last month</strong> • 30-day money-back guarantee • Join 1,000+ Pro & Premium members
        </div>
      </div>

      {/* Billing Period Toggle */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-400">Billed</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition">
            Monthly
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-700 text-slate-500 hover:text-slate-300 transition">
            Yearly <span className="text-green-400 text-xs ml-1">(Save 20%)</span>
          </button>
        </div>
      </div>

      {/* Current Plan Badge */}
      {currentPlan !== 'free' && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
          <p className="text-green-300 font-medium">
            ✅ You are currently on the <strong>{currentPlan.toUpperCase()}</strong> plan
          </p>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-lg border-2 p-6 relative transition ${
              currentPlan === plan.id
                ? 'border-blue-400 bg-blue-400/5'
                : plan.recommended
                ? 'border-purple-400 bg-purple-400/5'
                : 'border-slate-700 bg-slate-900/50'
            }`}
          >
            {/* Recommended Badge */}
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Plan Name */}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-400">{plan.price}</span>
              <span className="text-slate-400 text-sm">{plan.period}</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            {currentPlan === plan.id ? (
              <button disabled className="w-full px-4 py-3 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.id as 'pro' | 'premium')}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg font-medium transition ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
                } disabled:opacity-50`}
              >
                {loading ? '⏳ Processing...' : plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="border-t border-slate-800 pt-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-slate-300 hover:text-slate-100 transition">
              Can I change my plan anytime?
            </summary>
            <p className="text-slate-400 text-sm mt-2 pl-4">
              Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-slate-300 hover:text-slate-100 transition">
              What payment methods do you accept?
            </summary>
            <p className="text-slate-400 text-sm mt-2 pl-4">
              We accept all major credit cards via Stripe. More payment methods coming soon.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-slate-300 hover:text-slate-100 transition">
              Is there a free trial?
            </summary>
            <p className="text-slate-400 text-sm mt-2 pl-4">
              Absolutely! Try Pro or Premium free for 14 days. No credit card required.
            </p>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-slate-300 hover:text-slate-100 transition">
              Can I get a refund?
            </summary>
            <p className="text-slate-400 text-sm mt-2 pl-4">
              30-day money-back guarantee. No questions asked. Just email support@bigbrainmoves.com
            </p>
          </details>
        </div>
      </div>

      {/* Support Link */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
        <p className="text-slate-300 mb-3">Have questions about our plans?</p>
        <a href="mailto:support@bigbrainmoves.com" className="text-blue-400 hover:text-blue-300 font-medium">
          Contact our support team →
        </a>
      </div>
    </div>
  )
}
