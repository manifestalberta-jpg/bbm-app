'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={64} className="mx-auto mb-6 text-green-400" />
        <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-dark-400 mb-8">
          Thank you for upgrading. Your premium features are now active.
        </p>

        <div className="bg-dark-800 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-bold text-white mb-4">What's Next:</h3>
          <ul className="space-y-2 text-dark-300">
            <li>✅ Access your analytics dashboard</li>
            <li>✅ Unlock unlimited topics</li>
            <li>✅ Enable email delivery</li>
            <li>✅ Join the referral program</li>
          </ul>
        </div>

        <Link
          href="/preferences"
          className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
        >
          <span>Go to Dashboard</span>
          <ArrowRight size={20} />
        </Link>

        <p className="text-dark-500 text-sm mt-8">
          Questions? Contact support@bigbrainmoves.app
        </p>
      </div>
    </div>
  );
}
