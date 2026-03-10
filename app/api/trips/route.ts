import { NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
const trips: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const { userId, destinations, startDate, endDate, homeAirport } = await req.json();

    if (!userId || !destinations || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tripId = `trip-${Date.now()}`;
    
    // Generate flight deals for each destination
    const itinerary = destinations.map((dest: string, index: number) => ({
      destination: dest,
      day: index + 1,
      googleFlightsLink: `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(dest)}+from+${encodeURIComponent(homeAirport || 'LAX')}`,
      activities: [],
      restaurants: [],
      deals: [],
    }));

    trips[tripId] = {
      id: tripId,
      userId,
      destinations,
      startDate,
      endDate,
      homeAirport,
      itinerary,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(trips[tripId], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const userTrips = Object.values(trips).filter((t: any) => t.userId === userId);
    return NextResponse.json(userTrips);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { tripId, itinerary } = await req.json();

    if (!tripId || !itinerary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!trips[tripId]) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    trips[tripId].itinerary = itinerary;
    trips[tripId].updatedAt = new Date();

    return NextResponse.json(trips[tripId]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}
