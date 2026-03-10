import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '../../../lib/stripe'
import { trackSubscription } from '../../../lib/ga4'

/**
 * Create a Stripe checkout session
 * SECURITY: Validates plan, sanitizes email
 */
export async function POST(request: NextRequest) {
  try {
    const { planId, email } = await request.json()

    // Validate plan
    if (!['pro', 'premium'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Get base URL
    const baseUrl = request.headers.get('origin') || 'https://bbm-app.vercel.app'

    // Create checkout session
    const sessionId = await createCheckoutSession(planId, email, baseUrl)

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    // Track subscription attempt
    trackSubscription(planId as 'pro' | 'premium')

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
