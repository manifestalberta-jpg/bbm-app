'use client';

import { Download, Share2 } from 'lucide-react';
import Image from 'next/image';

interface NewsletterCardProps {
  topic: string;
}

const mockNewsletters: Record<string, any> = {
  dieting: {
    title: 'Mediterranean Diet: 7-Day Meal Plan',
    description: 'Discover the health benefits of Mediterranean cuisine with easy recipes and local grocery deals.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    author: 'Chef Maria',
  },
  budgeting: {
    title: 'Smart Money Management 2026',
    description: 'Learn proven strategies to save money, invest wisely, and achieve financial freedom.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    author: 'Finance Expert',
  },
  dating: {
    title: 'First Date Ideas & Conversation Starters',
    description: 'Impress your date with creative ideas and proven conversation techniques.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    author: 'Dating Coach',
  },
};

export default function NewsletterCard({ topic }: NewsletterCardProps) {
  const newsletter = mockNewsletters[topic] || mockNewsletters.dieting;

  return (
    <div className="glass rounded-xl overflow-hidden hover:shadow-xl transition-smooth group">
      <div className="relative h-48 overflow-hidden bg-dark-800">
        <img
          src={newsletter.imageUrl}
          alt={newsletter.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{newsletter.title}</h3>
        <p className="text-dark-400 mb-4 line-clamp-2">{newsletter.description}</p>
        <p className="text-sm text-dark-500 mb-4">By {newsletter.author}</p>
        <div className="flex space-x-2">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <Download size={18} />
            <span>PDF</span>
          </button>
          <button className="flex-1 bg-dark-700 hover:bg-dark-600 text-dark-300 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
