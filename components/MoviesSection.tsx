'use client';

import { useEffect, useState } from 'react';
import { Film, ExternalLink } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  releaseDate: string;
  genre: string;
  imdbLink: string;
  trailerLink: string;
  description: string;
}

export default function MoviesSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="text-dark-400">Loading movies...</div>;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <Film size={24} className="text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Upcoming Movies</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movies.slice(0, 4).map((movie) => (
          <div key={movie.id} className="glass rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-white mb-2">{movie.title}</h3>
            <p className="text-dark-400 text-sm mb-3">{movie.description}</p>
            <div className="flex justify-between text-xs text-dark-500 mb-4">
              <span>{movie.genre}</span>
              <span className="text-green-400">Release: {movie.releaseDate}</span>
            </div>
            <div className="flex space-x-2">
              <a
                href={movie.imdbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
              >
                <span>IMDb</span>
                <ExternalLink size={14} />
              </a>
              <a
                href={movie.trailerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
              >
                <span>Trailer</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
