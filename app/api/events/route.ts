import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { interests, city } = await req.json();

    if (!interests || interests.length === 0) {
      return NextResponse.json({ error: 'interests required' }, { status: 400 });
    }

    const interestArray = Array.isArray(interests) ? interests : [interests];
    const events = interestArray.slice(0, 6).map((interest: string, index: number) => ({
      id: `event-${index}`,
      title: `${interest.charAt(0).toUpperCase() + interest.slice(1)} Meetup`,
      type: interest,
      date: new Date(Date.now() + (3 + index * 3) * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      location: city || 'Your City',
      eventbriteLink: `https://www.eventbrite.com/e/find-events/?q=${encodeURIComponent(interest)}&loc=${encodeURIComponent(city || '')}`,
      meetupLink: `https://www.meetup.com/find/?keywords=${encodeURIComponent(interest)}&location=${encodeURIComponent(city || '')}`,
      description: `Connect with fellow ${interest} enthusiasts in ${city || 'your area'}`,
    }));

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const interest = searchParams.get('interest');
  const city = searchParams.get('city');

  if (!interest) {
    return NextResponse.json({ error: 'interest query parameter required' }, { status: 400 });
  }

  return NextResponse.json({
    eventbriteLink: `https://www.eventbrite.com/e/find-events/?q=${encodeURIComponent(interest)}&loc=${encodeURIComponent(city || '')}`,
    meetupLink: `https://www.meetup.com/find/?keywords=${encodeURIComponent(interest)}&location=${encodeURIComponent(city || '')}`,
  });
}
