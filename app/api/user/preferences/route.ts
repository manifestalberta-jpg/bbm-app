import { NextRequest, NextResponse } from 'next/server'

const APPROVED_TOPICS = [
  'Dieting', 'Budgeting', 'Date Ideas', 'Building Attraction',
  'Relationship Counselling', 'New Careers', 'Music & Concerts',
  'Vacation Planning', 'Experiences', 'Time Management', 'Deal Hunting',
]

/**
 * User Preferences API
 * MVP Version
 */
export async function POST(request: NextRequest) {
  try {
    const { topics, emailTime, timezone } = await request.json()

    if (topics && !topics.every((t: string) => APPROVED_TOPICS.includes(t))) {
      return NextResponse.json({ error: 'Invalid topic' }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Preferences updated',
      preferences: { topics, emailTime, timezone },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    preferences: {
      topics: [],
      emailTime: '08:00',
      timezone: 'UTC',
    },
  })
}
