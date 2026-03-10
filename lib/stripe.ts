import Stripe from 'stripe'

/**
 * Initialize Stripe server-side
 * SECURITY: Uses secret key (server-side only)
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

/**
 * Plan configuration with Stripe price IDs
 * TODO: Replace with actual Stripe product/price IDs from dashboard
 */
export const PLANS = {
  pro: {
    name: 'Pro',
    price: 4.99,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      'All topics available',
      'PDF + image generation',
      'Email scheduling',
      'Priority support',
      'Offline access',
    ],
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Everything in Pro',
      'AI-powered recommendations',
      'Custom delivery times',
      'Advanced analytics',
      '24/7 priority support',
      'Early access to features',
    ],
  },
}

/**
 * Create a checkout session for subscription
 * SECURITY: Validates plan, constructs return URLs safely
 */
export async function createCheckoutSession(
  planId: 'pro' | 'premium',
  email: string,
  baseUrl: string
): Promise<string | null> {
  try {
    const plan = PLANS[planId]
    if (!plan) throw new Error('Invalid plan')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        planId,
        email,
      },
    })

    return session.id
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return null
  }
}

/**
 * Retrieve checkout session details
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session
  } catch (error) {
    console.error('Failed to retrieve checkout session:', error)
    return null
  }
}

/**
 * Get customer subscription status
 */
export async function getCustomerSubscription(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    })

    if (subscriptions.data.length === 0) return null
    return subscriptions.data[0]
  } catch (error) {
    console.error('Failed to get subscription:', error)
    return null
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
    return subscription
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    return null
  }
}

/**
 * Get publishable key (client-side safe)
 */
export function getPublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
}
