'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext'
import {
  LogOut, PanelLeft, PanelLeftClose, Sun, Moon,
  Settings, LayoutDashboard, Users, Activity
} from 'lucide-react'
import ErrorToast from '@/components/ErrorToast'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, userRole, loading } = useApp()
  const { theme, toggleTheme } = useTheme()

  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || ''
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null

  if (pathname === '/login' || pathname.startsWith('/auth/')) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: pathname === '/dashboard' || pathname === '/' },
    { href: '/activity', label: 'Activity', icon: Activity, active: pathname === '/activity' },
  ]

  const adminNavItems = [
    { href: '/users', label: 'Users', icon: Users, active: pathname === '/users' },
  ]

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <a href="#main-content" className="sr-only">Skip to content</a>

      {/* Top Bar */}
      <header className="h-12 flex items-center justify-between px-4 flex-shrink-0 border-b" style={{ background: 'linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(59, 130, 246, 0.08))', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          {/* Placeholder logo */}
          <div className="h-7 w-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            W
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Web App</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--text-muted)' }}>v1.0.0</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" style={{ color: 'var(--text-secondary)' }}>
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs" style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm hidden sm:block" style={{ color: 'var(--text-primary)' }}>{displayName}</span>
            <span className="text-xs capitalize hidden md:block" style={{ color: 'var(--text-muted)' }}>({userRole})</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarExpanded ? 'w-36' : 'w-12'} flex flex-col transition-all duration-200 flex-shrink-0 border-r`} style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
          <nav className="p-2 space-y-1" aria-label="Main navigation">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${item.active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} ${!sidebarExpanded ? 'justify-center' : ''}`}
                title={item.label}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarExpanded && <span>{item.label}</span>}
              </Link>
            ))}

            {(userRole === 'admin' || userRole === 'manager') && adminNavItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${item.active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} ${!sidebarExpanded ? 'justify-center' : ''}`}
                title={item.label}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarExpanded && <span>{item.label}</span>}
              </Link>
            ))}

            <div className="my-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}></div>

            <Link
              href="/settings"
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${pathname === '/settings' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'} ${!sidebarExpanded ? 'justify-center' : ''}`}
              title="Settings"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              {sidebarExpanded && <span>Settings</span>}
            </Link>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Sign out"
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-slate-400 hover:bg-red-600 hover:text-white transition-colors ${!sidebarExpanded ? 'justify-center' : ''}`}
              title="Log out"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {sidebarExpanded && <span>Log out</span>}
            </button>

            <div className="my-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}></div>

            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors ${!sidebarExpanded ? 'justify-center' : ''}`}
              aria-label="Toggle sidebar"
            >
              {sidebarExpanded ? <PanelLeftClose className="w-4 h-4 flex-shrink-0" /> : <PanelLeft className="w-4 h-4 flex-shrink-0" />}
              {sidebarExpanded && <span>Sidebar</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="rounded-xl p-6 w-full max-w-sm border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Confirm Logout</h3>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Are you sure you want to log out?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <ErrorToast />
    </div>
  )
}
