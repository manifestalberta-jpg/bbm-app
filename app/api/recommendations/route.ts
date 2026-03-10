import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, engagementHistory } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Mock recommendation engine
    const topicScores = {
      'Dieting': { score: 0.85, reason: 'High engagement with recipes' },
      'Budgeting': { score: 0.72, reason: 'Viewed 3 budget articles' },
      'Deals': { score: 0.68, reason: 'Frequent deal clicks' },
      'Dating': { score: 0.45, reason: 'Low engagement' },
      'Vacation Planning': { score: 0.92, reason: 'Recently viewed trip planner' },
      'Time Management': { score: 0.58, reason: 'Used planner 5 times' },
    };

    const recommendations = Object.entries(topicScores)
      .map(([topic, data]) => ({
        topic,
        score: data.score,
        reason: data.reason,
        shouldRecommend: data.score > 0.6,
      }))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      userId,
      recommendations,
      topRecommendations: recommendations.filter((r) => r.shouldRecommend).slice(0, 3),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  // Return mock recommendations
  return NextResponse.json({
    userId,
    topRecommendations: [
      {
        topic: 'Vacation Planning',
        score: 0.92,
        reason: 'Recently viewed trip planner',
      },
      {
        topic: 'Dieting',
        score: 0.85,
        reason: 'High engagement with recipes',
      },
      {
        topic: 'Deals',
        score: 0.68,
        reason: 'Frequent deal clicks',
      },
    ],
  });
}
