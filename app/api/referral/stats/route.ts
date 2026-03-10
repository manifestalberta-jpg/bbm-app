import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Get referral stats for a user
 * SECURITY: Should validate userId from auth in production
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Get referral code and stats
    const referralCode = await prisma.referralCode.findUnique({
      where: { userId },
      include: {
        referrals: {
          select: {
            id: true,
            refereeEmail: true,
            refereeName: true,
            status: true,
            convertedAt: true,
            referrerReward: true,
            createdAt: true,
          },
        },
      },
    })

    if (!referralCode) {
      return NextResponse.json(
        { error: 'No referral code found' },
        { status: 404 }
      )
    }

    // Calculate stats
    const conversions = referralCode.referrals.filter((r: any) => r.status === 'converted').length
    const rewardsClaimed = referralCode.rewardsClaimed || 0
    const rewardsAvailable = referralCode.rewardBalance - rewardsClaimed

    return NextResponse.json({
      code: referralCode.code,
      url: `https://bbm-app.vercel.app?ref=${referralCode.code}`,
      stats: {
        views: referralCode.views,
        clicks: referralCode.clicks,
        signups: referralCode.signups,
        conversions,
        conversionRate: referralCode.signups > 0 
          ? ((conversions / referralCode.signups) * 100).toFixed(1)
          : '0.0',
      },
      rewards: {
        balance: referralCode.rewardBalance,
        claimed: rewardsClaimed,
        available: rewardsAvailable,
      },
      referrals: referralCode.referrals.map((r: any) => ({
        email: r.refereeEmail,
        name: r.refereeName,
        status: r.status,
        convertedAt: r.convertedAt,
        reward: r.referrerReward,
        date: r.createdAt,
      })),
    })
  } catch (error) {
    console.error('Referral stats failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
