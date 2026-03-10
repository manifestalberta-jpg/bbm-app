import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Big Brain Moves',
  description: 'Personalized daily newsletters for smart living',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Big Brain Moves',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/pwa-192x192.png',
  },
  openGraph: {
    title: 'Big Brain Moves',
    description: 'Personalized daily newsletters for smart living',
    type: 'website',
    url: 'https://bigbrainmoves.com',
    images: [
      {
        url: '/pwa-512x512.png',
        width: 512,
        height: 512,
        alt: 'Big Brain Moves',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Big Brain Moves" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                🧠 Big Brain Moves
              </h1>
            </div>
          </header>
          <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
            {children}
          </main>
        </div>
        <PWAInstaller />
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
        )}
      </body>
    </html>
  )
}

function PWAInstaller() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(reg => {
              console.log('✅ Service Worker registered');
            }).catch(err => {
              console.error('❌ Service Worker registration failed:', err);
            });
          }

          let deferredPrompt = null;
          window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault();
            deferredPrompt = e;
            console.log('📲 Install prompt available');
          });

          window.addEventListener('appinstalled', () => {
            console.log('✅ App installed to home screen');
            deferredPrompt = null;
          });

          window.addEventListener('load', () => {
            // Check if app is in standalone mode (installed)
            if (window.navigator.standalone === true) {
              console.log('🚀 Running in standalone mode');
              document.body.classList.add('pwa-standalone');
            }
          });
        `,
      }}
    />
  )
}
