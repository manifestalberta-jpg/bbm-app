import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Mock stats - in Phase 2, fetch from database
    const stats = {
      referralCode: `REF${userId.substring(0, 6).toUpperCase()}`,
      totalReferred: 0,
      pendingReferred: 0,
      completedReferred: 0,
      totalBonus: '$0.00',
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=REF${userId.substring(0, 6).toUpperCase()}`,
      referrals: [] as any[],
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
