import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Generate or retrieve user's referral code
 * SECURITY: Should be behind auth in production
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing userId or email' },
        { status: 400 }
      )
    }

    // Check if user already has a referral code
    let referralCode = await prisma.referralCode.findUnique({
      where: { userId },
    })

    // If not, create one
    if (!referralCode) {
      referralCode = await prisma.referralCode.create({
        data: {
          userId,
          code: `BBM-${email.split('@')[0].toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        },
      })
    }

    return NextResponse.json({
      code: referralCode.code,
      url: `https://bbm-app.vercel.app?ref=${referralCode.code}`,
    })
  } catch (error) {
    console.error('Referral generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    )
  }
}
