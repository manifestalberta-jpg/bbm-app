'use client';

import { XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle size={64} className="mx-auto mb-6 text-red-400" />
        <h1 className="text-4xl font-bold text-white mb-4">Payment Cancelled</h1>
        <p className="text-dark-400 mb-8">
          No worries! Your payment was not processed. You can try again anytime.
        </p>

        <div className="bg-dark-800 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-bold text-white mb-4">Why upgrade?</h3>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li>🎯 Ad-free experience for focused reading</li>
            <li>🔓 Unlimited topics and personalization</li>
            <li>📊 Advanced analytics and insights</li>
            <li>💰 Referral bonuses and rewards</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/pricing"
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors w-full justify-center"
          >
            <span>Back to Pricing</span>
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/"
            className="inline-block text-dark-400 hover:text-green-400 transition-colors"
          >
            Continue with Free Plan
          </Link>
        </div>

        <p className="text-dark-500 text-sm mt-8">
          Have questions? We're here to help at support@bigbrainmoves.app
        </p>
      </div>
    </div>
  );
}
