'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out',
    features: [
      'Daily newsletters (3 topics max)',
      'Basic planner',
      'Trip finder',
      'Community features',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    interval: '/month',
    description: 'For daily users',
    features: [
      'All Free features',
      'Ad-free experience',
      'Unlimited topics',
      'Custom preferences',
      'Email delivery',
      'Drag-drop planner',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$9.99',
    interval: '/month',
    description: 'Maximum value',
    features: [
      'All Pro features',
      'Analytics dashboard',
      'Advanced trip planning',
      'Priority support',
      'Referral bonuses',
      'Weekly insights',
      'API access (coming soon)',
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">
            Simple, Transparent Pricing
          </h1>
          <p className="text-dark-400 text-lg mb-8">
            Choose the plan that fits your lifestyle
          </p>

          <div className="inline-flex bg-dark-800 rounded-lg p-1 mb-12">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2 rounded transition-colors ${
                billing === 'monthly'
                  ? 'bg-green-500 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-6 py-2 rounded transition-colors ${
                billing === 'annual'
                  ? 'bg-green-500 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 transition-all ${
                plan.highlighted
                  ? 'glass border border-green-500 shadow-lg shadow-green-500/20 md:scale-105'
                  : 'glass'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold w-fit mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-dark-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.interval && <span className="text-dark-400">{plan.interval}</span>}
              </div>

              <button
                className={`w-full py-3 rounded-lg font-bold transition-colors mb-8 ${
                  plan.highlighted
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-dark-800 hover:bg-dark-700 text-dark-300'
                }`}
              >
                Get Started
              </button>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-dark-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-dark-400 mb-4">Ready to get started?</p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            <span>Start Free</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
