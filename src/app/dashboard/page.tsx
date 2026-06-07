'use client'

import { useState } from 'react'

const TABS = ['Tab 1', 'Tab 2', 'Tab 3']

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Tab 1')

  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Overview of your app</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6" style={{ borderColor: 'var(--border-color)' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors -mb-px border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:border-slate-300'
            }`}
            style={{ color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="flex-1 rounded-xl border flex items-center justify-center"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', minHeight: '300px' }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{activeTab}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Replace this with your content</p>
        </div>
      </div>
    </div>
  )
}
