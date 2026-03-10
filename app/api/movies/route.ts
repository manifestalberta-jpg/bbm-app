import { NextResponse } from 'next/server';

const movieDatabase = {
  RECOMMENDATIONS: [
    {
      id: 'mov-1',
      title: 'Dune: Part Three',
      releaseDate: 'April 2026',
      genre: 'Sci-Fi',
      imdbLink: 'https://www.imdb.com/title/tt0047434/',
      rottenTomatoes: 'https://www.rottentomatoes.com/search?search=dune',
      trailerLink: 'https://www.youtube.com/results?search_query=Dune+Trailer+2026',
      description: 'The continuation of Paul Atreides\' epic journey',
    },
    {
      id: 'mov-2',
      title: 'Oppenheimer 2',
      releaseDate: 'May 2026',
      genre: 'Drama/Thriller',
      imdbLink: 'https://www.imdb.com/title/tt0816692/',
      rottenTomatoes: 'https://www.rottentomatoes.com/search?search=oppenheimer',
      trailerLink: 'https://www.youtube.com/results?search_query=Oppenheimer+Trailer',
      description: 'The untold story continues',
    },
    {
      id: 'mov-3',
      title: 'Avatar: Fire Nation',
      releaseDate: 'June 2026',
      genre: 'Sci-Fi/Action',
      imdbLink: 'https://www.imdb.com/title/tt0499549/',
      rottenTomatoes: 'https://www.rottentomatoes.com/search?search=avatar',
      trailerLink: 'https://www.youtube.com/results?search_query=Avatar+Trailer+2026',
      description: 'Return to Pandora in stunning IMAX 3D',
    },
    {
      id: 'mov-4',
      title: 'Blade Runner 3',
      releaseDate: 'July 2026',
      genre: 'Sci-Fi/Noir',
      imdbLink: 'https://www.imdb.com/title/tt0083658/',
      rottenTomatoes: 'https://www.rottentomatoes.com/search?search=blade+runner',
      trailerLink: 'https://www.youtube.com/results?search_query=Blade+Runner+Trailer+2026',
      description: 'The future of humanity awaits',
    },
  ],
};

export async function POST(req: Request) {
  try {
    const { favoriteMovies } = await req.json();

    const recommendations = movieDatabase.RECOMMENDATIONS;
    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(movieDatabase.RECOMMENDATIONS);
}
