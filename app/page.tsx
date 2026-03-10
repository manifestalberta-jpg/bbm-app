'use client';

import { useState, useEffect } from 'react';
import TopicTabs from '@/components/TopicTabs';
import NewsletterCard from '@/components/NewsletterCard';
import SearchBox from '@/components/SearchBox';
import TrendingTopics from '@/components/TrendingTopics';
import MoviesSection from '@/components/MoviesSection';
import ConcertsSection from '@/components/ConcertsSection';
import JobsSection from '@/components/JobsSection';
import ExperiencesSection from '@/components/ExperiencesSection';

const TOPICS = [
  { id: 'dieting', name: 'Dieting', icon: '🥗', color: 'from-green-400 to-emerald-500' },
  { id: 'budgeting', name: 'Budgeting', icon: '💰', color: 'from-blue-400 to-cyan-500' },
  { id: 'dating', name: 'Dating & Attraction', icon: '💕', color: 'from-pink-400 to-rose-500' },
  { id: 'relationship', name: 'Relationships', icon: '💑', color: 'from-purple-400 to-violet-500' },
  { id: 'careers', name: 'Careers', icon: '💼', color: 'from-amber-400 to-orange-500' },
  { id: 'music', name: 'Music & Concerts', icon: '🎵', color: 'from-indigo-400 to-blue-500' },
  { id: 'vacation', name: 'Vacation Planning', icon: '✈️', color: 'from-sky-400 to-blue-500' },
  { id: 'experiences', name: 'Experiences', icon: '🎪', color: 'from-fuchsia-400 to-pink-500' },
  { id: 'time-management', name: 'Time Management', icon: '⏰', color: 'from-red-400 to-pink-500' },
  { id: 'deals', name: 'Deal Hunting', icon: '🎁', color: 'from-yellow-400 to-amber-500' },
];

export default function Dashboard() {
  const [selectedTopic, setSelectedTopic] = useState('dieting');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPrefs, setUserPrefs] = useState({
    city: '',
    favoriteArtists: '',
    desiredCareer: '',
    interests: '',
  });

  useEffect(() => {
    // Load user preferences from localStorage (set in /preferences page)
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setUserPrefs({
        city: prefs.city || '',
        favoriteArtists: prefs.favoriteArtists || '',
        desiredCareer: prefs.desiredCareer || '',
        interests: prefs.interests || '',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">Big Brain Moves</span>
          </h1>
          <p className="text-dark-400 text-lg">Your personalized daily newsletter & smart planner</p>
        </div>

        {/* Search and Trending */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SearchBox onSearch={setSearchQuery} />
          </div>
          <div>
            <TrendingTopics />
          </div>
        </div>

        {/* Topic Tabs */}
        <div className="mb-8">
          <TopicTabs
            topics={TOPICS}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
          />
        </div>

        {/* Newsletter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <NewsletterCard topic={selectedTopic} />
          <NewsletterCard topic={selectedTopic} />
          <NewsletterCard topic={selectedTopic} />
        </div>

        {/* Movies Section */}
        <MoviesSection />

        {/* Concerts Section */}
        <ConcertsSection favoriteArtists={userPrefs.favoriteArtists} city={userPrefs.city} />

        {/* Jobs Section */}
        <JobsSection desiredCareer={userPrefs.desiredCareer} city={userPrefs.city} />

        {/* Experiences Section */}
        <ExperiencesSection interests={userPrefs.interests} city={userPrefs.city} />
      </div>
    </div>
  );
}
