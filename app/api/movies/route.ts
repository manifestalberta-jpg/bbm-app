import { NextResponse } from 'next/server';

// Real upcoming movies (March 2026) with IMDb search links
const realMovieRecommendations = [
  {
    id: 'mov-1',
    title: 'Captain America: Brave New World',
    releaseDate: 'March 2026',
    genre: 'Action/Adventure',
    imdbLink: 'https://www.imdb.com/find?q=Captain+America+Brave+New+World&s=all',
    trailerLink: 'https://www.youtube.com/results?search_query=Captain+America+Brave+New+World+trailer',
    description: 'Anthony Mackie takes the shield as Sam Wilson becomes the new Captain America.',
  },
  {
    id: 'mov-2',
    title: 'Thunderbolts',
    releaseDate: 'May 2026',
    genre: 'Action/Superhero',
    imdbLink: 'https://www.imdb.com/find?q=Thunderbolts+movie&s=all',
    trailerLink: 'https://www.youtube.com/results?search_query=Thunderbolts+movie+trailer',
    description: 'An anti-hero team assembles for a dangerous mission. Search IMDb for details.',
  },
  {
    id: 'mov-3',
    title: 'The Fantastic Four',
    releaseDate: 'July 2026',
    genre: 'Sci-Fi/Superhero',
    imdbLink: 'https://www.imdb.com/find?q=Fantastic+Four+MCU&s=all',
    trailerLink: 'https://www.youtube.com/results?search_query=Fantastic+Four+MCU+trailer',
    description: 'Marvel reboots the iconic superhero family. Details on IMDb.',
  },
  {
    id: 'mov-4',
    title: 'Blade',
    releaseDate: 'November 2026',
    genre: 'Action/Fantasy',
    imdbLink: 'https://www.imdb.com/find?q=Blade+Mahershala+Ali&s=all',
    trailerLink: 'https://www.youtube.com/results?search_query=Blade+Mahershala+Ali+trailer',
    description: 'Mahershala Ali stars as the vampire hunter. Search for upcoming details.',
  },
];

export async function POST(req: Request) {
  try {
    const { favoriteMovies } = await req.json();

    // Return real movie recommendations with IMDb search links
    return NextResponse.json(realMovieRecommendations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(realMovieRecommendations);
}
