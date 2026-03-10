import { NextRequest, NextResponse } from 'next/server'

/**
 * Comprehensive Analytics API
 * Aggregates all user metrics, revenue, engagement, and referral data
 * SECURITY: Should validate userId from session in production
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || '30' // days

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // In production: query actual data from Prisma
    // For now, return realistic mock analytics data

    const analytics = generateMockAnalytics(userId, parseInt(period))

    return NextResponse.json({
      userId,
      period: `${period} days`,
      analytics,
    })
  } catch (error) {
    console.error('Analytics failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

/**
 * Generate realistic mock analytics data
 * Demonstrates expected data structure and metrics
 */
function generateMockAnalytics(userId: string, daysBack: number) {
  const now = new Date()
  const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

  return {
    // Key Performance Indicators
    kpis: {
      totalNewsletters: 45,
      totalTopics: 7,
      avgOpenRate: 68.5,
      avgClickRate: 23.2,
      totalRevenueGenerated: 299.95, // in dollars
      monthlyRecurringRevenue: 89.97,
      totalReferrals: 12,
      referralConversions: 4,
    },

    // Topic Performance
    topics: [
      {
        name: 'Budgeting',
        emails: 12,
        opens: 10,
        clicks: 6,
        openRate: 83,
        clickRate: 50,
        saves: 8,
        shares: 3,
        rating: 4.8,
      },
      {
        name: 'Deal Hunting',
        emails: 11,
        opens: 9,
        clicks: 5,
        openRate: 82,
        clickRate: 45,
        saves: 7,
        shares: 4,
        rating: 4.7,
      },
      {
        name: 'Time Management',
        emails: 10,
        opens: 6,
        clicks: 2,
        openRate: 60,
        clickRate: 20,
        saves: 3,
        shares: 1,
        rating: 3.9,
      },
      {
        name: 'Dieting',
        emails: 8,
        opens: 4,
        clicks: 1,
        openRate: 50,
        clickRate: 12,
        saves: 1,
        shares: 0,
        rating: 3.2,
      },
      {
        name: 'Music & Concerts',
        emails: 4,
        opens: 2,
        clicks: 0,
        openRate: 50,
        clickRate: 0,
        saves: 0,
        shares: 0,
        rating: 2.8,
      },
    ],

    // Engagement Trends (last 30 days by week)
    engagementTrend: [
      { week: 'Week 1', opens: 22, clicks: 8, saves: 4 },
      { week: 'Week 2', opens: 25, clicks: 9, saves: 5 },
      { week: 'Week 3', opens: 28, clicks: 11, saves: 6 },
      { week: 'Week 4', opens: 26, clicks: 10, saves: 5 },
    ],

    // Revenue Breakdown
    revenue: {
      total: 299.95,
      byPlan: {
        free: { count: 1, revenue: 0 },
        pro: { count: 2, revenue: 119.96 },
        premium: { count: 1, revenue: 179.99 },
      },
      monthly: [
        { month: 'Jan', revenue: 99.99 },
        { month: 'Feb', revenue: 199.98 },
        { month: 'Mar', revenue: 0 },
      ],
    },

    // Referral Analytics
    referrals: {
      totalReferred: 12,
      conversions: 4,
      conversionRate: 33.3,
      rewardBalance: 5, // months of free access
      topReferrer: 'You (from Instagram)',
      bySource: [
        { source: 'Direct', count: 3 },
        { source: 'Instagram', count: 5 },
        { source: 'Twitter', count: 2 },
        { source: 'Email', count: 2 },
      ],
    },

    // User Behavior
    behavior: {
      totalSessions: 87,
      avgSessionDuration: '12 min',
      returningRate: 94.2,
      churnRisk: 'Low',
      favoriteTime: '8:00 AM',
      favoriteDay: 'Tuesday',
    },

    // Device & Browser
    devices: {
      mobile: 55,
      desktop: 35,
      tablet: 10,
    },

    browsers: [
      { name: 'Chrome', percentage: 65 },
      { name: 'Safari', percentage: 20 },
      { name: 'Firefox', percentage: 10 },
      { name: 'Other', percentage: 5 },
    ],

    // Period Info
    period: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      daysAnalyzed: daysBack,
    },
  }
}
