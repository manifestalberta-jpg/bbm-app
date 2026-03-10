import { NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
const plans: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const { userId, date, items } = await req.json();

    if (!userId || !date || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const planId = `${userId}-${date}`;
    plans[planId] = {
      id: planId,
      userId,
      date,
      items,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(plans[planId], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const planId = date ? `${userId}-${date}` : null;
    const result = planId ? plans[planId] : Object.values(plans).filter((p: any) => p.userId === userId);

    return NextResponse.json(result || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { planId, items } = await req.json();

    if (!planId || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!plans[planId]) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    plans[planId].items = items;
    plans[planId].updatedAt = new Date();

    return NextResponse.json(plans[planId]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}
