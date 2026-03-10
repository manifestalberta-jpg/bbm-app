import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

const PLANS = {
  PRO: {
    name: 'Pro',
    price: 499, // $4.99 in cents
    interval: 'month',
    features: ['Ad-free newsletters', 'Custom topics', 'Email delivery'],
  },
  PREMIUM: {
    name: 'Premium',
    price: 999, // $9.99 in cents
    interval: 'month',
    features: ['Everything in Pro', 'Analytics dashboard', 'Priority support', 'Trip planner integration'],
  },
};

export async function POST(req: Request) {
  try {
    const { planType, email, userId } = await req.json();

    if (!planType || !email || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!PLANS[planType as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const plan = PLANS[planType as keyof typeof PLANS];

    // Create or get Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Big Brain Moves - ${plan.name} Plan`,
              description: plan.features.join(', '),
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
      metadata: {
        userId,
        planType,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
