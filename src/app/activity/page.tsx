'use client'

import { Activity } from 'lucide-react'

export default function ActivityPage() {
  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Activity</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Recent events and logs</p>
      </div>

      <div
        className="flex-1 rounded-xl border flex items-center justify-center"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', minHeight: '300px' }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Activity className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </div>
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Activity Feed</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Replace this with your activity log content</p>
        </div>
      </div>
    </div>
  )
}
