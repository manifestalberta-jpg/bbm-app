import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Big Brain Moves - Daily Newsletter & Planner',
  description: 'Personalized daily newsletters, editable planner, and travel deals all in one',
  manifest: '/manifest.json',
  themeColor: '#22c55e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-dark-900 text-dark-50 antialiased">
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
// Phase 1 Live
