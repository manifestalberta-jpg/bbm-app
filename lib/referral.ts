/**
 * Referral Program Utilities
 * Handles referral tracking, code generation, and reward management
 */

/**
 * Track referral click (when someone clicks a referral link)
 */
export async function trackReferralClick(code: string): Promise<boolean> {
  try {
    const response = await fetch('/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, action: 'click' }),
    })
    return response.ok
  } catch (error) {
    console.error('Failed to track referral click:', error)
    return false
  }
}

/**
 * Track referral signup (when referee signs up)
 */
export async function trackReferralSignup(
  code: string,
  refereeEmail: string,
  refereeName?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        action: 'signup',
        refereeEmail,
        refereeName,
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Failed to track referral signup:', error)
    return false
  }
}

/**
 * Track referral conversion (when referee upgrades to paid)
 */
export async function trackReferralConversion(
  code: string,
  refereeEmail: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        action: 'conversion',
        refereeEmail,
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Failed to track referral conversion:', error)
    return false
  }
}

/**
 * Get referral code from URL params
 */
export function getReferralCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('ref')
}

/**
 * Store referral code in localStorage for later use
 */
export function storeReferralCode(code: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('referralCode', code)
  }
}

/**
 * Get stored referral code
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('referralCode')
}

/**
 * Format referral URL
 */
export function formatReferralUrl(code: string): string {
  return `https://bbm-app.vercel.app?ref=${code}`
}
