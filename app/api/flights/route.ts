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

    // Return real Google Flights deep links (no fake prices)
    const deals = destinations.map((dest: string) => ({
      destination: dest,
      googleFlightsLink: `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(dest)}+from+${encodeURIComponent(homeAirport)}`,
      kayakLink: `https://www.kayak.com/flights/${homeAirport}-${dest}`,
      skyscannerLink: `https://www.skyscanner.com/flights/${homeAirport}/${dest}`,
      expediaLink: `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${homeAirport},to:${dest}`,
      note: 'Click links above to compare real-time prices across providers',
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
    destination,
    googleFlightsLink: `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(destination)}+from+${encodeURIComponent(homeAirport)}`,
    kayakLink: `https://www.kayak.com/flights/${homeAirport}-${destination}`,
    skyscannerLink: `https://www.skyscanner.com/flights/${homeAirport}/${destination}`,
    expediaLink: `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${homeAirport},to:${destination}`,
    note: 'Search real-time prices on the links above',
  });
}
