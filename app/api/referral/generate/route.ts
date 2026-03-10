import { NextResponse } from 'next/server';

function generateReferralCode(userId: string, name?: string): string {
  const base = (name || userId).substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${base}${random}`;
}

export async function POST(req: Request) {
  try {
    const { userId, name } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const code = generateReferralCode(userId, name);

    // In Phase 2, this would save to database via Prisma
    // For now, return generated code
    return NextResponse.json({
      code,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${code}`,
      bonus: '$5 credit for each successful referral',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  // Mock: In Phase 2, fetch from database
  const code = `REF${userId.substring(0, 6).toUpperCase()}`;

  return NextResponse.json({
    code,
    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${code}`,
    stats: {
      referred: 0,
      credited: 0,
      totalBonus: '$0',
    },
  });
}
