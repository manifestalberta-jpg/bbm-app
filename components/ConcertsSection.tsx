'use client';

import { useEffect, useState } from 'react';
import { Music, ExternalLink } from 'lucide-react';

interface Concert {
  id: string;
  artist: string;
  date: string;
  venue: string;
  ticketLink: string;
  bandsintown: string;
  presaleInfo: string;
}

interface ConcertsSectionProps {
  favoriteArtists?: string;
  city?: string;
}

export default function ConcertsSection({ favoriteArtists = '', city = '' }: ConcertsSectionProps) {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (favoriteArtists.trim()) {
      fetchConcerts();
    }
  }, [favoriteArtists, city]);

  const fetchConcerts = async () => {
    setLoading(true);
    try {
      const artists = favoriteArtists
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a);

      const response = await fetch('/api/concerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoriteArtists: artists,
          city: city || 'Your City',
        }),
      });

      const data = await response.json();
      setConcerts(data);
      setHasData(true);
    } catch (error) {
      console.error('Failed to fetch concerts:', error);
    }
    setLoading(false);
  };

  if (!hasData && !favoriteArtists.trim()) {
    return (
      <div className="mb-12 glass rounded-xl p-8 text-center">
        <Music size={32} className="mx-auto mb-4 text-purple-400" />
        <h3 className="text-lg font-semibold text-white mb-2">Music & Concerts</h3>
        <p className="text-dark-400">
          Add your favorite artists in{' '}
          <a href="/preferences" className="text-purple-400 hover:underline">
            Preferences
          </a>{' '}
          to see upcoming shows!
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-dark-400 mb-12">Loading concerts...</div>;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <Music size={24} className="text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Upcoming Concerts</h2>
      </div>
      {concerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concerts.map((concert) => (
            <div key={concert.id} className="glass rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-white mb-2">{concert.artist}</h3>
              <p className="text-dark-400 text-sm mb-3">{concert.date}</p>
              <p className="text-dark-500 text-sm mb-4">{concert.venue}</p>
              <div className="bg-dark-800 rounded p-3 mb-4">
                <p className="text-xs text-green-400 font-semibold">{concert.presaleInfo}</p>
              </div>
              <div className="flex space-x-2">
                <a
                  href={concert.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Ticketmaster</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href={concert.bandsintown}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-dark-300 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Bandsintown</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-6 text-center text-dark-400">
          <p>No concerts found. Update your favorite artists in Preferences!</p>
        </div>
      )}
    </div>
  );
}
