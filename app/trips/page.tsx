'use client';

import { useState } from 'react';
import { MapPin, Calendar, DollarSign, ExternalLink } from 'lucide-react';

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  googleFlightsLink: string;
  estimatedPrice?: string;
}

export default function TripsPage() {
  const [homeAirport, setHomeAirport] = useState('LAX');
  const [destinations, setDestinations] = useState<string[]>(['', '', '']);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  const updateDestination = (index: number, value: string) => {
    const newDestinations = [...destinations];
    newDestinations[index] = value;
    setDestinations(newDestinations);
  };

  const findFlights = async () => {
    setLoading(true);
    try {
      const validDestinations = destinations.filter((d) => d.trim());
      if (!validDestinations.length) {
        alert('Please enter at least one destination');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeAirport,
          destinations: validDestinations,
        }),
      });

      const data = await response.json();
      const newTrips = data.deals.map((deal: any, index: number) => ({
        id: `trip-${Date.now()}-${index}`,
        destination: deal.destination,
        startDate: deal.departureDate,
        endDate: new Date(new Date(deal.departureDate).getTime() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        googleFlightsLink: deal.googleFlightsLink,
        estimatedPrice: deal.estimatedPrice,
      }));
      setTrips(newTrips);
    } catch (error) {
      alert('Error finding flights');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Trip Planner</h1>

        {/* Flight finder form */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Find Flight Deals</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark-300 mb-2">
              Home Airport (IATA code)
            </label>
            <input
              type="text"
              value={homeAirport}
              onChange={(e) => setHomeAirport(e.target.value.toUpperCase())}
              placeholder="e.g., LAX, JFK, ORD"
              className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark-300 mb-2">
              Destinations (up to 3)
            </label>
            <div className="space-y-3">
              {destinations.map((dest, index) => (
                <input
                  key={index}
                  type="text"
                  value={dest}
                  onChange={(e) => updateDestination(index, e.target.value)}
                  placeholder={`Destination ${index + 1} (e.g., Paris, Tokyo, Miami)`}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
                />
              ))}
            </div>
          </div>

          <button
            onClick={findFlights}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Searching...' : 'Find Flights'}
          </button>
        </div>

        {/* Trip cards */}
        {trips.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Available Trips</h2>
            {trips.map((trip) => (
              <div key={trip.id} className="glass rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <MapPin size={24} className="text-green-400" />
                      {trip.destination}
                    </h3>
                    <p className="text-dark-400 flex items-center gap-2 mt-2">
                      <Calendar size={16} />
                      {trip.startDate} to {trip.endDate}
                    </p>
                    <p className="text-dark-400 flex items-center gap-2 mt-1">
                      <DollarSign size={16} />
                      {trip.estimatedPrice || 'Check Google Flights'}
                    </p>
                  </div>
                  <a
                    href={trip.googleFlightsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    Book Now
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
