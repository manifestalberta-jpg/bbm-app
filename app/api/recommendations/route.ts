import { NextRequest, NextResponse } from 'next/server'
import {
  calculateEngagementScores,
  getRecommendedTopics,
  generateRecommendationExplanation,
  getRecommendationConfidence,
} from '@/lib/recommendations'

/**
 * GET /api/recommendations?userId=X&currentTopics=topic1,topic2
 * Returns personalized topic recommendations for user
 * SECURITY: Should validate userId from session in production
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const topicsParam = searchParams.get('currentTopics')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Parse current topics (comma-separated string)
    let currentTopics: string[] = []
    if (topicsParam) {
      currentTopics = topicsParam.split(',').map(t => t.trim())
    }

    // Calculate engagement scores based on user history
    const engagementScores = await calculateEngagementScores(userId)

    // Get recommended topics
    const recommended = getRecommendedTopics(engagementScores, currentTopics, 3)

    // Build response with explanations and confidence
    const recommendations = recommended.map(item => ({
      topic: item.topic,
      explanation: generateRecommendationExplanation(item.topic, engagementScores),
      confidence: getRecommendationConfidence(item.score),
      score: item.score,
      interactions: item.interactions,
    }))

    return NextResponse.json({
      userId,
      recommendations,
      topicsToConsider: recommended.length,
    })
  } catch (error) {
    console.error('Recommendations failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/recommendations/track
 * Track user engagement with a topic
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, topic, action, source } = await request.json()

    if (!userId || !topic || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate action
    const validActions = ['view', 'select', 'save', 'share', 'open_email']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // In production: save to database
    // For now, just log the engagement
    console.log(`Tracked engagement: ${userId} - ${action} on ${topic}`)

    return NextResponse.json({
      success: true,
      tracked: { userId, topic, action, source },
    })
  } catch (error) {
    console.error('Tracking failed:', error)
    return NextResponse.json(
      { error: 'Failed to track engagement' },
      { status: 500 }
    )
  }
}
