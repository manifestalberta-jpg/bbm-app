/**
 * Social Proof Component
 * Displays trust signals, testimonials, and user stats
 */

export default function SocialProof() {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Marketing Manager',
      text: 'Finally a newsletter that actually knows what I care about. No more generic content!',
      avatar: '👩‍💼',
    },
    {
      name: 'Alex K.',
      role: 'Entrepreneur',
      text: 'Saved me hours every week. The deal alerts alone have paid for my subscription 3x over.',
      avatar: '👨‍💻',
    },
    {
      name: 'Jordan P.',
      role: 'Finance Analyst',
      text: 'The personalization is insane. It feels like it was written just for me. Highly recommend.',
      avatar: '👩‍🔬',
    },
  ]

  return (
    <div className="space-y-8 py-8 border-t border-slate-800">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-400">1.2K+</p>
          <p className="text-xs text-slate-400 mt-1">Active Users</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-400">4.9★</p>
          <p className="text-xs text-slate-400 mt-1">Average Rating</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-400">98%</p>
          <p className="text-xs text-slate-400 mt-1">Satisfaction Rate</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-pink-400">3.2M</p>
          <p className="text-xs text-slate-400 mt-1">Data Points Used</p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">What Users Say</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{testimonial.avatar}</span>
                <div>
                  <p className="font-semibold text-slate-100">{testimonial.name}</p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 italic">"{testimonial.text}"</p>
              <p className="text-xs text-blue-400 mt-3">⭐⭐⭐⭐⭐</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4">Trusted By</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Privacy-first (no data selling)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Encrypted end-to-end</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>100% uptime guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌍</span>
            <span>Used in 15+ countries</span>
          </div>
        </div>
      </div>
    </div>
  )
}
