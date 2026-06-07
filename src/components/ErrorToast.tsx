'use client'

import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { X, AlertCircle } from 'lucide-react'

export default function ErrorToast() {
  const { lastError, clearError } = useApp()

  useEffect(() => {
    if (!lastError) return
    const timer = setTimeout(clearError, 8000)
    return () => clearTimeout(timer)
  }, [lastError, clearError])

  if (!lastError) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-md animate-slide-up" role="alert" aria-live="assertive">
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border"
        style={{ background: 'var(--bg-primary)', borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--text-primary)' }}
      >
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-400">Error</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{lastError}</p>
        </div>
        <button onClick={clearError} className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors" aria-label="Dismiss error">
          <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </div>
  )
}
