import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Track referral interactions (click, signup, conversion)
 */
export async function POST(request: NextRequest) {
  try {
    const { code, action, refereeEmail, refereeName } = await request.json()

    if (!code || !action) {
      return NextResponse.json(
        { error: 'Missing code or action' },
        { status: 400 }
      )
    }

    // Find referral code
    const referralCode = await prisma.referralCode.findUnique({
      where: { code },
    })

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    // Track the action
    if (action === 'click') {
      await prisma.referralCode.update({
        where: { id: referralCode.id },
        data: { clicks: { increment: 1 } },
      })
    } else if (action === 'signup') {
      // Create referral record
      if (!refereeEmail) {
        return NextResponse.json(
          { error: 'Missing refereeEmail for signup' },
          { status: 400 }
        )
      }

      await prisma.referralCode.update({
        where: { id: referralCode.id },
        data: { signups: { increment: 1 } },
      })

      await prisma.referral.create({
        data: {
          referrerId: referralCode.userId,
          referralCodeId: referralCode.id,
          refereeEmail,
          refereeName: refereeName || undefined,
        },
      })
    } else if (action === 'conversion') {
      // User upgraded to paid plan
      if (!refereeEmail) {
        return NextResponse.json(
          { error: 'Missing refereeEmail for conversion' },
          { status: 400 }
        )
      }

      // Update code stats
      await prisma.referralCode.update({
        where: { id: referralCode.id },
        data: {
          conversions: { increment: 1 },
          rewardBalance: { increment: 1 }, // 1 month per conversion
        },
      })

      // Update referral record
      const referral = await prisma.referral.findFirst({
        where: {
          referralCodeId: referralCode.id,
          refereeEmail,
        },
      })

      if (referral) {
        await prisma.referral.update({
          where: { id: referral.id },
          data: {
            status: 'converted',
            convertedAt: new Date(),
            referrerReward: 1,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Referral tracking failed:', error)
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    )
  }
}
