'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, LogOut, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const DIET_TYPES = ['KETO', 'VEGAN', 'MEDITERRANEAN', 'PALEO', 'LOW_CARB', 'BALANCED'];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    homeAirport: '',
    destinations: '',
    dietType: 'BALANCED',
    favoriteArtists: '',
    favoriteMovies: '',
    interests: '',
    desiredCareer: '',
    receiveDailyPDF: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && initialLoad) {
      loadSettings();
      setInitialLoad(false);
    }
  }, [status, router, initialLoad]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          city: data.city || '',
          homeAirport: data.homeAirport || '',
          destinations: data.destinations ? JSON.parse(data.destinations).join(', ') : '',
          dietType: data.dietType || 'BALANCED',
          favoriteArtists: data.favoriteArtists ? JSON.parse(data.favoriteArtists).join(', ') : '',
          favoriteMovies: data.favoriteMovies ? JSON.parse(data.favoriteMovies).join(', ') : '',
          interests: data.interests ? JSON.parse(data.interests).join(', ') : '',
          desiredCareer: data.desiredCareer || '',
          receiveDailyPDF: data.receiveDailyPDF ?? true,
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          city: formData.city,
          homeAirport: formData.homeAirport,
          destinations: formData.destinations.split(',').map((d) => d.trim()).filter(Boolean),
          dietType: formData.dietType,
          favoriteArtists: formData.favoriteArtists.split(',').map((a) => a.trim()).filter(Boolean),
          favoriteMovies: formData.favoriteMovies.split(',').map((m) => m.trim()).filter(Boolean),
          interests: formData.interests.split(',').map((i) => i.trim()).filter(Boolean),
          desiredCareer: formData.desiredCareer,
          receiveDailyPDF: formData.receiveDailyPDF,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-dark-400">Manage your preferences and account</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center space-x-2 bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-400" />
            <p className="text-green-400">Settings saved successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center space-x-2">
                  <Mail size={18} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-dark-400 cursor-not-allowed"
                />
                <p className="text-xs text-dark-500 mt-2">Email verified and cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Travel & Location */}
          <div className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Travel & Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Toronto, Vancouver"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Home Airport</label>
                <input
                  type="text"
                  name="homeAirport"
                  value={formData.homeAirport}
                  onChange={handleChange}
                  placeholder="e.g., YYJ, YVR, YYZ"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Favorite Destinations (comma-separated)</label>
                <input
                  type="text"
                  name="destinations"
                  value={formData.destinations}
                  onChange={handleChange}
                  placeholder="e.g., Paris, Tokyo, NYC"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Personal Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Diet Type</label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                >
                  {DIET_TYPES.map((diet) => (
                    <option key={diet} value={diet}>
                      {diet}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Favorite Artists (comma-separated)</label>
                <input
                  type="text"
                  name="favoriteArtists"
                  value={formData.favoriteArtists}
                  onChange={handleChange}
                  placeholder="e.g., Taylor Swift, The Weeknd"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Favorite Movies (comma-separated)</label>
                <input
                  type="text"
                  name="favoriteMovies"
                  value={formData.favoriteMovies}
                  onChange={handleChange}
                  placeholder="e.g., Inception, Dune"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Interests (comma-separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g., hiking, cooking, gaming"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Desired Career</label>
                <input
                  type="text"
                  name="desiredCareer"
                  value={formData.desiredCareer}
                  onChange={handleChange}
                  placeholder="e.g., Product Manager"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Newsletter Settings */}
          <div className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Newsletter Settings</h2>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="receiveDailyPDF"
                checked={formData.receiveDailyPDF}
                onChange={handleChange}
                className="w-5 h-5 bg-dark-800 border border-dark-700 rounded mt-1 cursor-pointer accent-green-500"
              />
              <div>
                <p className="text-white font-semibold">Receive Daily Customized PDF Newsletter</p>
                <p className="text-dark-400 text-sm">Get your personalized newsletter PDF sent to {session?.user?.email} daily</p>
              </div>
            </label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-bold py-3 rounded-lg transition-colors"
          >
            <Save size={20} />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
