'use client';

import Link from 'next/link';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

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
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link href="/" className="text-dark-300 hover:text-green-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/diet" className="text-dark-300 hover:text-green-400 transition-colors">
              Diet
            </Link>
            <Link href="/trip-builder" className="text-dark-300 hover:text-green-400 transition-colors">
              Build Trip
            </Link>
            <Link href="/pricing" className="text-dark-300 hover:text-green-400 transition-colors font-semibold">
              Pricing
            </Link>
            <Link href="/analytics" className="text-dark-300 hover:text-green-400 transition-colors">
              Analytics
            </Link>

            {session?.user ? (
              <>
                <Link href="/settings" className="text-dark-300 hover:text-green-400 transition-colors flex items-center space-x-1">
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-dark-300 hover:text-red-400 transition-colors flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-dark-300 hover:text-green-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-dark-300 hover:text-green-400">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block text-dark-300 hover:text-green-400 py-2">
              Dashboard
            </Link>
            <Link href="/diet" className="block text-dark-300 hover:text-green-400 py-2">
              Diet
            </Link>
            <Link href="/trip-builder" className="block text-dark-300 hover:text-green-400 py-2">
              Build Trip
            </Link>
            <Link href="/pricing" className="block text-dark-300 hover:text-green-400 py-2">
              Pricing
            </Link>
            <Link href="/analytics" className="block text-dark-300 hover:text-green-400 py-2">
              Analytics
            </Link>

            {session?.user ? (
              <>
                <Link href="/settings" className="block text-dark-300 hover:text-green-400 py-2">
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="block w-full text-left text-dark-300 hover:text-red-400 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-dark-300 hover:text-green-400 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
