'use client';

import { useEffect, useState } from 'react';
import { Zap, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  eventbriteLink: string;
  meetupLink: string;
  description: string;
}

interface ExperiencesSectionProps {
  interests?: string;
  city?: string;
}

export default function ExperiencesSection({ interests = '', city = '' }: ExperiencesSectionProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (interests.trim()) {
      fetchEvents();
    }
  }, [interests, city]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const interestList = interests
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: interestList,
          city: city || 'Your City',
        }),
      });

      const data = await response.json();
      setEvents(data);
      setHasData(true);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
    setLoading(false);
  };

  if (!hasData && !interests.trim()) {
    return (
      <div className="mb-12 glass rounded-xl p-8 text-center">
        <Zap size={32} className="mx-auto mb-4 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white mb-2">Experiences & Events</h3>
        <p className="text-dark-400">
          Add your interests in{' '}
          <a href="/preferences" className="text-yellow-400 hover:underline">
            Preferences
          </a>{' '}
          to discover local events and meetups!
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-dark-400 mb-12">Loading events...</div>;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <Zap size={24} className="text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Local Events & Experiences</h2>
      </div>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="glass rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-white">{event.title}</h3>
                <span className="inline-block bg-yellow-600 bg-opacity-30 text-yellow-400 px-2 py-1 rounded text-xs font-semibold mt-2">
                  {event.type}
                </span>
              </div>
              <p className="text-dark-400 text-sm mb-2">{event.date}</p>
              <p className="text-dark-500 text-sm mb-3">📍 {event.location}</p>
              <p className="text-dark-400 text-xs mb-4 line-clamp-2">{event.description}</p>
              <div className="flex space-x-2">
                <a
                  href={event.eventbriteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Eventbrite</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href={event.meetupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-dark-300 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Meetup</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-6 text-center text-dark-400">
          <p>No events found. Update your interests in Preferences!</p>
        </div>
      )}
    </div>
  );
}
