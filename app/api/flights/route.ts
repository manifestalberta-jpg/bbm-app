import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { homeAirport, destinations } = await req.json();

    if (!homeAirport || !destinations || destinations.length === 0) {
      return NextResponse.json(
        { error: 'homeAirport and destinations are required' },
        { status: 400 }
      );
    }

    const deals = destinations.map((dest: string) => ({
      destination: dest,
      googleFlightsLink: `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(dest)}+from+${encodeURIComponent(homeAirport)}`,
      airlineDirectLink: `https://www.expedia.com/Flights`,
      estimatedPrice: `$${Math.floor(Math.random() * 400) + 150}`,
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));

    return NextResponse.json({ deals });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flight deals' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const homeAirport = searchParams.get('homeAirport');
  const destination = searchParams.get('destination');

  if (!homeAirport || !destination) {
    return NextResponse.json(
      { error: 'homeAirport and destination query parameters are required' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    googleFlightsLink: `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(destination)}+from+${encodeURIComponent(homeAirport)}`,
    estimatedPrice: `$${Math.floor(Math.random() * 400) + 150}`,
  });
}
