import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, emailOpenHistory } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Mock delivery time optimization
    const timeAnalysis = {
      morningOpens: { opens: 45, rate: 0.82, time: '06:00-09:00' },
      afternoonOpens: { opens: 23, rate: 0.45, time: '12:00-15:00' },
      eveningOpens: { opens: 78, rate: 0.91, time: '18:00-21:00' },
      nightOpens: { opens: 12, rate: 0.22, time: '21:00-06:00' },
    };

    // Find best time (highest open rate)
    let bestTime: any = { key: 'evening', rate: 0, opens: 0, time: '' };
    Object.entries(timeAnalysis).forEach(([key, val]) => {
      if (val.rate > bestTime.rate) {
        bestTime = { key, ...val };
      }
    });

    return NextResponse.json({
      userId,
      currentDeliveryTime: '09:00',
      recommendedDeliveryTime: '19:00', // 7 PM (evening peak)
      timeAnalysis,
      bestPerformingWindow: bestTime,
      expectedImpactOnOpenRate: '+24%',
      confidence: 0.87,
      analysisBasedOn: '158 opens over last 30 days',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze delivery times' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  return NextResponse.json({
    userId,
    currentDeliveryTime: '09:00',
    recommendedDeliveryTime: '19:00',
    expectedImpact: '+24%',
    bestWindow: '18:00-21:00',
    confidence: 0.87,
  });
}
