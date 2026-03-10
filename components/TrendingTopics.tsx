'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TrendingTopics() {
  const [trending, setTrending] = useState<string[]>([]);

  useEffect(() => {
    const mockTrending = [
      'Budget Travel Hacks 2026',
      'Keto Meal Prep',
      'Remote Job Tips',
      'Dating Profile Tips',
      'Time Management',
    ];
    setTrending(mockTrending);
  }, []);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp size={20} className="text-green-400" />
        <h3 className="text-lg font-bold text-white">Trending Now</h3>
      </div>
      <div className="space-y-2">
        {trending.map((topic, index) => (
          <button
            key={index}
            className="w-full text-left px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-green-400 transition-colors text-sm"
          >
            {index + 1}. {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
