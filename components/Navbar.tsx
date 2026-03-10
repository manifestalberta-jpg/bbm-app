'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-dark-900 bg-opacity-95 backdrop-blur-md border-b border-dark-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BBM</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">Big Brain Moves</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 text-sm">
            <Link href="/" className="text-dark-300 hover:text-green-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/planner" className="text-dark-300 hover:text-green-400 transition-colors">
              Planner
            </Link>
            <Link href="/diet" className="text-dark-300 hover:text-green-400 transition-colors">
              Diet
            </Link>
            <Link href="/trips" className="text-dark-300 hover:text-green-400 transition-colors">
              Trips
            </Link>
            <Link href="/trip-builder" className="text-dark-300 hover:text-green-400 transition-colors">
              Build Trip
            </Link>
            <Link href="/preferences" className="text-dark-300 hover:text-green-400 transition-colors">
              Profile
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dark-300 hover:text-green-400"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block text-dark-300 hover:text-green-400 py-2">
              Dashboard
            </Link>
            <Link href="/planner" className="block text-dark-300 hover:text-green-400 py-2">
              Planner
            </Link>
            <Link href="/trips" className="block text-dark-300 hover:text-green-400 py-2">
              Trips
            </Link>
            <Link href="/preferences" className="block text-dark-300 hover:text-green-400 py-2">
              Preferences
            </Link>
            <Link href="/settings" className="block text-dark-300 hover:text-green-400 py-2">
              Settings
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
