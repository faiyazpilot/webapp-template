'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Something went wrong</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
