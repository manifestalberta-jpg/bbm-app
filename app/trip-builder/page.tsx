'use client';

import { useState } from 'react';
import { MapPin, Calendar, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  notes: string;
}

interface TripDay {
  day: number;
  destination: string;
  activities: ItineraryItem[];
}

export default function TripBuilderPage() {
  const [homeAirport, setHomeAirport] = useState('LAX');
  const [destinations, setDestinations] = useState(['Paris', 'Rome', 'Barcelona']);
  const [tripDays, setTripDays] = useState<TripDay[]>([
    { day: 1, destination: 'Paris', activities: [] },
    { day: 2, destination: 'Paris', activities: [] },
    { day: 3, destination: 'Paris', activities: [] },
    { day: 4, destination: 'Rome', activities: [] },
    { day: 5, destination: 'Rome', activities: [] },
    { day: 6, destination: 'Barcelona', activities: [] },
  ]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [newActivity, setNewActivity] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newLocation, setNewLocation] = useState('');

  const currentDay = tripDays[currentDayIndex];

  const addActivity = () => {
    if (!newActivity.trim()) return;

    const updatedDays = [...tripDays];
    updatedDays[currentDayIndex].activities.push({
      id: `act-${Date.now()}`,
      time: newTime,
      activity: newActivity,
      location: newLocation,
      notes: '',
    });
    setTripDays(updatedDays);
    setNewActivity('');
    setNewLocation('');
  };

  const deleteActivity = (activityId: string) => {
    const updatedDays = [...tripDays];
    updatedDays[currentDayIndex].activities = updatedDays[
      currentDayIndex
    ].activities.filter((a) => a.id !== activityId);
    setTripDays(updatedDays);
  };

  const sortedActivities = [...currentDay.activities].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/trips" className="flex items-center space-x-2 text-dark-400 hover:text-green-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Trips</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-gradient">Trip Itinerary Builder</h1>

        {/* Trip Overview */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-dark-400 text-sm mb-2">Departing from:</p>
              <p className="text-2xl font-bold text-green-400">{homeAirport}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-2">Destinations:</p>
              <div className="flex gap-2">
                {destinations.map((dest, i) => (
                  <span key={i} className="bg-green-600 bg-opacity-30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-dark-400 text-sm">{tripDays.length}-day itinerary</p>
        </div>

        {/* Day Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-min">
            {tripDays.map((day, index) => (
              <button
                key={index}
                onClick={() => setCurrentDayIndex(index)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-smooth ${
                  index === currentDayIndex
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                Day {day.day} • {day.destination}
              </button>
            ))}
          </div>
        </div>

        {/* Current Day Details */}
        <div className="glass rounded-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <Calendar size={24} className="text-green-400" />
            <h2 className="text-3xl font-bold text-white">
              Day {currentDay.day}: {currentDay.destination}
            </h2>
          </div>

          {/* Add Activity */}
          <div className="bg-dark-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-white">Add Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Activity (e.g., Visit Eiffel Tower)"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
              />
              <button
                onClick={addActivity}
                className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Activities Timeline */}
          {sortedActivities.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white mb-4">Itinerary</h3>
              {sortedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-dark-800 rounded-lg p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="text-green-400 font-bold text-sm">{activity.time}</p>
                    <p className="text-white font-semibold">{activity.activity}</p>
                    {activity.location && (
                      <p className="text-dark-400 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {activity.location}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="text-dark-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-dark-400">
              <p>No activities yet. Add your first one above!</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-8 border-t border-dark-700">
            <button
              onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
              disabled={currentDayIndex === 0}
              className="px-6 py-2 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 text-dark-300 rounded-lg transition-colors"
            >
              ← Previous Day
            </button>
            <button
              onClick={() => setCurrentDayIndex(Math.min(tripDays.length - 1, currentDayIndex + 1))}
              disabled={currentDayIndex === tripDays.length - 1}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Next Day →
            </button>
          </div>
        </div>

        {/* Deals Section */}
        <div className="glass rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">💰 Find Deals</h3>
          <p className="text-dark-400 mb-6">Find flights, restaurants, and experiences for each destination</p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors">
            Find Deals for This Trip
          </button>
        </div>
      </div>
    </div>
  );
}
