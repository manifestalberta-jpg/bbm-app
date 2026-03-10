import { NextRequest, NextResponse } from 'next/server'

/**
 * Newsletter Send API
 * MVP Version
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, topics } = await request.json()

    if (!email || !topics) {
      return NextResponse.json({ error: 'Email and topics required' }, { status: 400 })
    }

    // Placeholder success response
    return NextResponse.json({
      message: 'Newsletter sent successfully',
      email,
      topics,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
