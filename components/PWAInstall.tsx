'use client'

import { useEffect, useState } from 'react'

export default function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS
    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isApple)

    // Check if already installed
    if ((window.navigator as any).standalone === true) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  // Don't show if already installed
  if (isInstalled) {
    return (
      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 text-sm text-green-300">
        ✅ App installed! You can now use Big Brain Moves offline.
      </div>
    )
  }

  // Don't show if no install prompt available (not on Chrome Android)
  if (!installPrompt && !isIOS) {
    return null
  }

  return (
    <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-lg">📱</span>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-300 mb-1">Install Big Brain Moves</h3>
            <p className="text-sm text-slate-400 mb-3">
              {isIOS
                ? 'Add to your home screen for quick access (no internet needed)'
                : 'Get offline access and a native app experience'}
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-slate-800/50 rounded p-3 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-slate-200">📲 Instructions (iOS):</p>
            <ol className="space-y-1 pl-4 list-decimal">
              <li>Tap the Share button (⬆️ arrow)</li>
              <li>Tap "Add to Home Screen"</li>
              <li>Tap "Add" in the top right</li>
            </ol>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition text-sm"
          >
            📥 Add to Home Screen
          </button>
        )}
      </div>
    </div>
  )
}
