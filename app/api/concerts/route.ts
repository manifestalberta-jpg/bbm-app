import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { favoriteArtists, city } = await req.json();

    if (!favoriteArtists || favoriteArtists.length === 0) {
      return NextResponse.json({ error: 'favoriteArtists required' }, { status: 400 });
    }

    const artists = Array.isArray(favoriteArtists) ? favoriteArtists : [favoriteArtists];
    const shows = artists.slice(0, 5).map((artist: string, index: number) => ({
      id: `concert-${index}`,
      artist: artist.trim(),
      date: new Date(Date.now() + (7 + index * 7) * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      venue: `${city || 'Local'} Arena`,
      ticketLink: `https://www.ticketmaster.com/search?q=${encodeURIComponent(artist.trim())}`,
      bandsintown: `https://www.bandsintown.com/a/${artist.trim().toLowerCase().replace(/\s+/g, '-')}`,
      presaleInfo: 'Pre-sale available via artist fan club or Spotify Verified Fan',
    }));

    return NextResponse.json(shows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch concerts' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const artist = searchParams.get('artist');

  if (!artist) {
    return NextResponse.json({ error: 'artist query parameter required' }, { status: 400 });
  }

  return NextResponse.json({
    artist,
    ticketLink: `https://www.ticketmaster.com/search?q=${encodeURIComponent(artist)}`,
    bandsintown: `https://www.bandsintown.com/a/${artist.toLowerCase().replace(/\s+/g, '-')}`,
  });
}
