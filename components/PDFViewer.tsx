'use client'

import { useState } from 'react'
import { trackPDFDownload } from '../lib/ga4'
import { generateSampleNewsletter } from '../lib/newsletter'

interface PDFViewerProps {
  topics: string[]
}

export default function PDFViewer({ topics }: PDFViewerProps) {
  const [loading, setLoading] = useState(false)
  const newsletter = generateSampleNewsletter(topics)

  const handleDownloadPDF = async () => {
    setLoading(true)
    try {
      // Simulate PDF generation
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics, newsletter }),
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `BBM-Newsletter-${new Date().toISOString().split('T')[0]}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        
        // Track PDF download event
        trackPDFDownload(topics.join(','))
      }
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          📰 {newsletter.title}
        </h3>
        <p className="text-sm text-slate-400">{newsletter.date}</p>

        {/* Sections */}
        <div className="space-y-6 mt-6">
          {Object.entries(newsletter.sections).map(([sectionName, content]: any) => (
            <div
              key={sectionName}
              className="border-l-4 border-blue-400/50 pl-4 space-y-2"
            >
              <h4 className="font-bold text-blue-300">{sectionName}</h4>
              {content.headline && (
                <p className="font-semibold text-slate-100">{content.headline}</p>
              )}
              {content.tips && (
                <ul className="space-y-2 text-sm text-slate-300">
                  {content.tips.map((tip: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
              {content.review_source && (
                <p className="text-xs text-slate-500 italic">
                  Source: {content.review_source}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? '⏳ Generating...' : '⬇️ Download PDF'}
          </button>
          <button className="px-6 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg font-medium transition">
            📧 Email to me
          </button>
        </div>
        
        {/* Social Proof */}
        <div className="bg-slate-800/30 rounded-lg p-4 text-sm text-slate-300 space-y-2">
          <p className="flex items-center gap-2">
            <span>✅</span>
            <span><strong>1,200+ users</strong> download their newsletter daily</span>
          </p>
          <p className="flex items-center gap-2">
            <span>⭐</span>
            <span><strong>4.9/5 rating:</strong> "Life-changing personalization"</span>
          </p>
          <p className="flex items-center gap-2">
            <span>👥</span>
            <span>Join thousands getting smarter every morning</span>
          </p>
        </div>
      </div>
    </div>
  )
}
