'use client'

import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>App preferences and configuration</p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Theme */}
        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
          <div className="flex gap-3">
            {themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${theme === opt.value ? 'border-blue-600' : 'border-transparent'}`}
                style={{ background: 'var(--bg-secondary)', borderColor: theme === opt.value ? 'var(--accent)' : 'var(--border-color)' }}
              >
                <opt.icon className="w-5 h-5" style={{ color: theme === opt.value ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: theme === opt.value ? 'var(--accent)' : 'var(--text-muted)' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder section */}
        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Additional Settings</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add your app-specific settings here.</p>
        </div>
      </div>
    </div>
  )
}
