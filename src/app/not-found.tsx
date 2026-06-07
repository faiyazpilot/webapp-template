import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
      <div className="text-center p-8">
        <p className="text-5xl font-bold mb-4" style={{ color: 'var(--accent)' }}>404</p>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Page not found</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist.</p>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
