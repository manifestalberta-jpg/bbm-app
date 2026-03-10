'use client';

import { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PreferencesPage() {
  const [formData, setFormData] = useState({
    city: '',
    favoriteArtists: '',
    favoriteMovies: '',
    experienceSummary: '',
    interests: '',
    desiredCareer: '',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Save to localStorage (or API call in production)
    localStorage.setItem('userPreferences', JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 text-dark-400 hover:text-green-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-gradient">Preferences & Profile</h1>

        <div className="glass rounded-xl p-8">
          <div className="space-y-6">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">
                City/Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Los Angeles, New York, Toronto"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-dark-500 mt-1">Used for concerts, events, and job searches</p>
            </div>

            {/* Favorite Artists */}
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">
                Favorite Artists (comma-separated)
              </label>
              <input
                type="text"
                name="favoriteArtists"
                value={formData.favoriteArtists}
                onChange={handleChange}
                placeholder="e.g., Taylor Swift, The Weeknd, Billie Eilish"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-dark-500 mt-1">We'll find upcoming shows and pre-sale info</p>
            </div>

            {/* Favorite Movies */}
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">
                Favorite Movies (comma-separated)
              </label>
              <input
                type="text"
                name="favoriteMovies"
                value={formData.favoriteMovies}
                onChange={handleChange}
                placeholder="e.g., Dune, Oppenheimer, Avatar"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-dark-500 mt-1">Helps recommend similar upcoming releases</p>
            </div>

            {/* Experience Summary */}
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">
                Experience Summary / Resume Text
              </label>
              <textarea
                name="experienceSummary"
                value={formData.experienceSummary}
                onChange={handleChange}
                placeholder="Paste your resume, or describe: 5 years marketing, experience with social media, email campaigns, content strategy..."
                rows={5}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors font-mono text-sm"
              />
              <p className="text-xs text-dark-500 mt-1">Used for job recommendations</p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">
                Interests & Hobbies (comma-separated)
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g., hiking, cooking classes, networking, yoga, board games"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-dark-500 mt-1">We'll find local meetups and classes</p>
            </div>

            {/* Desired Career */}
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">
                Desired Career / Job Title
              </label>
              <input
                type="text"
                name="desiredCareer"
                value={formData.desiredCareer}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-dark-500 mt-1">Used for personalized job recommendations</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 mt-8"
            >
              <Save size={20} />
              <span>Save Preferences</span>
            </button>

            {saved && (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4 text-green-400">
                ✓ Preferences saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
