/**
 * Delivery Time Optimization
 * Analyzes user email open patterns to suggest best send times
 */

interface TimeSlotAnalysis {
  hour: number
  opens: number
  percentage: number
}

interface DeliveryOptimization {
  currentTime: string
  suggestedTime: string
  optimalHour: number
  confidence: number
  reason: string
  avgOpenRate: number
  peakDays: string[]
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * Analyze email open patterns for a user
 * Determines best hour to send based on historical opens
 */
export function analyzeEmailOpenPatterns(
  opens: Array<{ hourOfDay: number; dayOfWeek: number }>
): TimeSlotAnalysis[] {
  // Initialize 24-hour slots
  const slots: TimeSlotAnalysis[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    opens: 0,
    percentage: 0,
  }))

  // Count opens per hour
  opens.forEach(open => {
    slots[open.hourOfDay].opens++
  })

  // Calculate percentages
  const totalOpens = opens.length || 1
  slots.forEach(slot => {
    slot.percentage = (slot.opens / totalOpens) * 100
  })

  return slots.sort((a, b) => b.opens - a.opens)
}

/**
 * Find optimal send time based on open patterns
 * Returns hour (0-23) with highest open rate
 */
export function getOptimalSendHour(analysis: TimeSlotAnalysis[]): {
  hour: number
  confidence: number
} {
  if (analysis.length === 0) {
    return { hour: 8, confidence: 0 } // Default to 8 AM with 0 confidence
  }

  const topSlot = analysis[0]

  // Calculate confidence: if top hour is significantly better than average, higher confidence
  const avgPercentage = 100 / 24 // ~4.2%
  const confidence = Math.min(100, Math.max(0, (topSlot.percentage / avgPercentage) * 100))

  return {
    hour: topSlot.hour,
    confidence: Math.round(confidence),
  }
}

/**
 * Analyze peak days for email opens
 */
export function analyzePeakDays(
  opens: Array<{ hourOfDay: number; dayOfWeek: number }>
): { day: string; opens: number }[] {
  const dayOpens: Record<number, number> = {}

  // Count opens per day
  opens.forEach(open => {
    dayOpens[open.dayOfWeek] = (dayOpens[open.dayOfWeek] || 0) + 1
  })

  return Object.entries(dayOpens)
    .map(([dayNum, count]) => ({
      day: DAYS[parseInt(dayNum)] || 'Unknown',
      opens: count,
    }))
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 3) // Top 3 days
}

/**
 * Calculate average open rate
 */
export function calculateAverageOpenRate(
  totalSent: number,
  totalOpened: number
): number {
  if (totalSent === 0) return 0
  return (totalOpened / totalSent) * 100
}

/**
 * Generate human-friendly explanation for suggested time
 */
export function generateOptimizationReason(
  optimalHour: number,
  confidence: number,
  peakDays: string[]
): string {
  const period = optimalHour < 12 ? 'morning' : optimalHour < 18 ? 'afternoon' : 'evening'
  const time = optimalHour.toString().padStart(2, '0') + ':00'

  if (confidence < 30) {
    return `Not enough data yet. Try ${time} ${period} for now.`
  }

  if (confidence > 70) {
    return `${confidence}% confident you open emails around ${time} ${period}. ${peakDays.length > 0 ? `Best days: ${peakDays.slice(0, 2).join(', ')}.` : ''}`
  }

  return `Data suggests ${time} ${period} might work well. Try it for a week.`
}

/**
 * Convert hour (0-23) to HH:MM format
 */
export function hourToTimeString(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}

/**
 * Convert HH:MM format to hour (0-23)
 */
export function timeStringToHour(timeString: string): number {
  const [hourStr] = timeString.split(':')
  return parseInt(hourStr, 10)
}

/**
 * Get delivery optimization for user (mock data)
 */
export function generateOptimization(
  currentTime: string = '08:00'
): DeliveryOptimization {
  // Mock open data: user opens around 8-10 AM and 6-8 PM
  const mockOpens = [
    ...Array(5).fill({ hourOfDay: 8, dayOfWeek: 1 }),
    ...Array(4).fill({ hourOfDay: 9, dayOfWeek: 3 }),
    ...Array(3).fill({ hourOfDay: 7, dayOfWeek: 5 }),
    ...Array(6).fill({ hourOfDay: 18, dayOfWeek: 2 }),
    ...Array(4).fill({ hourOfDay: 19, dayOfWeek: 4 }),
  ]

  const analysis = analyzeEmailOpenPatterns(mockOpens)
  const { hour: optimalHour, confidence } = getOptimalSendHour(analysis)
  const peakDays = analyzePeakDays(mockOpens).map(d => d.day)
  const avgOpenRate = calculateAverageOpenRate(20, mockOpens.length)
  const suggestedTime = hourToTimeString(optimalHour)
  const reason = generateOptimizationReason(optimalHour, confidence, peakDays)

  return {
    currentTime,
    suggestedTime,
    optimalHour,
    confidence,
    reason,
    avgOpenRate,
    peakDays,
  }
}
