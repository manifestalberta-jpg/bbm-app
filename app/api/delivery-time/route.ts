import { NextRequest, NextResponse } from 'next/server'
import { generateOptimization } from '@/lib/delivery-time'

/**
 * GET /api/delivery-time?userId=X&currentTime=HH:MM
 * Analyze email open patterns and suggest optimal send time
 * SECURITY: Should validate userId from session in production
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const currentTime = searchParams.get('currentTime') || '08:00'

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // In production: query actual EmailOpen records from database
    // const opens = await prisma.emailOpen.findMany({
    //   where: { userId },
    //   select: { hourOfDay: true, dayOfWeek: true },
    // })

    // For now, generate mock optimization
    const optimization = generateOptimization(currentTime)

    return NextResponse.json({
      userId,
      optimization,
    })
  } catch (error) {
    console.error('Delivery time analysis failed:', error)
    return NextResponse.json(
      { error: 'Failed to analyze delivery time' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/delivery-time/apply
 * Apply the suggested delivery time for user
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, newTime } = await request.json()

    if (!userId || !newTime) {
      return NextResponse.json(
        { error: 'Missing userId or newTime' },
        { status: 400 }
      )
    }

    // Validate time format HH:MM
    if (!/^\d{2}:\d{2}$/.test(newTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM' },
        { status: 400 }
      )
    }

    // In production: update User.emailTime in database
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { emailTime: newTime },
    // })

    return NextResponse.json({
      success: true,
      userId,
      newTime,
      message: `Delivery time updated to ${newTime}`,
    })
  } catch (error) {
    console.error('Failed to apply delivery time:', error)
    return NextResponse.json(
      { error: 'Failed to apply changes' },
      { status: 500 }
    )
  }
}
