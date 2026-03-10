import DOMPurify from 'dompurify'

export interface Newsletter {
  title: string
  date: string
  sections: Record<string, any>
}

const NEWSLETTER_CONTENT: Record<string, any> = {
  Dieting: {
    headline: '🥗 Mediterranean Power Foods',
    tips: [
      'Canned sardines: 2x omega-3 of fresh salmon, $2-4 per tin',
      'Extra virgin olive oil: Kirkland (Costco) for best price/quality',
      'Lentil pasta (Barilla): Same texture, 2x protein vs regular pasta',
      'Leafy greens: Buy pre-washed spinach in bulk, lasts 2 weeks',
    ],
    review_source: 'Google Reviews + Reddit r/nutrition',
    images_needed: ['mediterranean_bowl', 'olive_oil_varieties'],
  },
  Budgeting: {
    headline: '💰 Monthly Budget Optimization',
    tips: [
      'Track subscriptions: Kill unused services ($20-50/month easy win)',
      'Grocery strategy: Buy proteins on sale, freeze for 3 months',
      'Cash-back credit cards: 2-3% on groceries = $200-300/year',
      'Bulk shopping at Costco/Sam\'s: Amortize membership in 3 months',
    ],
    review_source: 'r/personalfinance, YNAB community',
  },
  'Date Ideas': {
    headline: '💕 Spring Dating Strategy (Arizona)',
    tips: [
      'Camelback Mountain sunrise hikes: 5:30 AM = low crowds, great talk time',
      'First date flow: Hike at Papago Park (sunset 7:15 PM) → light dinner in Old Town',
      'Profile pic: Clear face, outdoor, genuine smile. NO group shots.',
      'Text game: Playful teasing > compliments. Ask open questions.',
    ],
    review_source: 'r/dating + local dating coaches',
  },
  'Building Attraction': {
    headline: '✨ Non-Negotiables',
    tips: [
      'Fitness: Visible strength = confidence signal (gym 4x/week minimum)',
      'Hygiene: Fresh haircut (every 4 weeks), cologne, clean clothes',
      'Status: Build skills/income that matter to you (not for others)',
      'Scarcity: Don\'t be always available. Have a life outside dating.',
    ],
    review_source: 'Psychology Today + relationship research',
  },
  'Relationship Counselling': {
    headline: '💬 Communication Framework',
    tips: [
      '"I feel X when Y happens" > blame. Example: "I feel unheard when you check your phone"',
      'Listen to respond, not to reply. Ask clarifying questions.',
      'Weekly check-in: 15 min Sunday night. No phones, just talk.',
      'If stuck: A good therapist costs $100-200/week, worth it.',
    ],
    review_source: 'Esther Perel, Gottman Institute',
  },
  'New Careers': {
    headline: '🚀 Skills That Scale',
    tips: [
      'Learn: Python, SQL, or JavaScript (3-6 months, $5k ROI first year)',
      'Network: 2 coffee chats/week with people in target industry',
      'Build in public: Start a blog/X account showcasing your work',
      'Interview prep: AlgoExpert + LeetCode (60 days, $200)',
    ],
    review_source: 'Y Combinator, Andreessen Horowitz essays',
  },
  'Music & Concerts': {
    headline: '🎵 What\'s Playing This Week',
    tips: [
      'Verify venue + dates on Songkick or Bandsintown (no fake alerts)',
      'VIP tickets: Worth it for smaller venues (<500 capacity)',
      'Early bird: Buy before "on sale" date, save 20-30%',
      'New artists to follow: [Updated weekly based on trends]',
    ],
    review_source: 'Pitchfork, Stereogum, local concert blogs',
  },
  'Vacation Planning': {
    headline: '✈️ Spring Getaway Guide',
    tips: [
      'Flights: Tuesday-Thursday, 2-3 months in advance, early morning',
      'Airbnb: Read reviews, confirm cancellation policy before booking',
      'Budget: $80-120/day for flights + $60-100/day for accommodation',
      'Passport: Renew now if within 6 months of expiry',
    ],
    review_source: 'Skyscanner, TripAdvisor, IResiduals blogs',
  },
  Experiences: {
    headline: '🎭 Events Worth Your Time',
    tips: [
      'Art openings: Usually free wine, meet interesting people',
      'Meetup groups: Tech, entrepreneurship, hobbies. Free, high-quality.',
      'Classes: Cooking, dance, art. $50-100/class, memorable skill',
      'Travel experiences: Prioritize over material goods (studies back this)',
    ],
    review_source: 'Meetup.com, local event calendars, Atlas Obscura',
  },
  'Time Management': {
    headline: '⏰ The 90-Minute Power Block',
    tips: [
      'Deep work: 90 min focused, 15 min break. Repeat 3-4x daily.',
      'No meetings before 11 AM (protect your creative peak)',
      'Calendar blocking: Treat time like money, budget it.',
      'Weekly review: Sunday 30 min. Plan next week, reflect on wins.',
    ],
    review_source: 'Cal Newport, Deep Work + time-tracking studies',
  },
  'Deal Hunting': {
    headline: '🎯 This Week\'s Best Deals',
    tips: [
      'Honey extension: Auto-applies coupon codes at checkout',
      'Slickdeals.net: Curated deals, skip the noise',
      'Price history: CamelCamelCamel for Amazon, Keepa for trends',
      'Flash sales: Set alerts on Epic Games (free games), Humble Bundle',
    ],
    review_source: 'Slickdeals, Reddit r/deals, Brad\'s Deals',
  },
}

export function generateSampleNewsletter(topics: string[]): Newsletter {
  const sections: Record<string, any> = {}

  for (const topic of topics) {
    if (NEWSLETTER_CONTENT[topic]) {
      sections[topic] = NEWSLETTER_CONTENT[topic]
    }
  }

  return {
    title: 'Big Brain Moves Daily Newsletter',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    sections,
  }
}

/**
 * Sanitize user input to prevent XSS attacks
 * SECURITY: Only allow plain text, no HTML/scripts
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML tags and scripts
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No tags allowed
    ALLOWED_ATTR: [],
  })
}

/**
 * Validate topic selection
 * SECURITY: Whitelist only approved topics
 */
export const APPROVED_TOPICS = [
  'Dieting',
  'Budgeting',
  'Date Ideas',
  'Building Attraction',
  'Relationship Counselling',
  'New Careers',
  'Music & Concerts',
  'Vacation Planning',
  'Experiences',
  'Time Management',
  'Deal Hunting',
]

export function validateTopics(topics: any): boolean {
  if (!Array.isArray(topics)) return false
  return topics.every(t => APPROVED_TOPICS.includes(t))
}
