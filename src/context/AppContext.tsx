'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AppContextType {
  user: User | null
  userRole: string
  isViewer: boolean
  loading: boolean
  lastError: string | null
  clearError: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string>('viewer')
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])

  const isViewer = useMemo(() => userRole === 'viewer', [userRole])
  const clearError = useCallback(() => setLastError(null), [])

  useEffect(() => {
    if (lastError) {
      const timer = setTimeout(() => setLastError(null), 8000)
      return () => clearTimeout(timer)
    }
  }, [lastError])

  useEffect(() => {
    if (initialized) return
    setInitialized(true)

    const init = async () => {
      const pathname = window.location.pathname
      const isAuthPage = pathname === '/login' || pathname.startsWith('/auth/')

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        if (!isAuthPage) window.location.href = '/login'
        setLoading(false)
        return
      }

      if (isAuthPage) {
        window.location.href = '/dashboard'
        return
      }

      setUser(user)

      const googleName = user.user_metadata?.full_name || user.user_metadata?.name || ''
      const googleEmail = user.email || ''

      // Check role — auto-create viewer if first login
      const { data: roleData } = await supabase
        .from('app_roles')
        .select('role, name, email')
        .eq('user_id', user.id)
        .single()

      if (roleData?.role) {
        setUserRole(roleData.role)
        if ((!roleData.name || !roleData.email) && (googleName || googleEmail)) {
          await supabase.from('app_roles').update({
            name: roleData.name || googleName || null,
            email: roleData.email || googleEmail || null,
          }).eq('user_id', user.id)
        }
      } else {
        const { error: insertError } = await supabase
          .from('app_roles')
          .insert({ user_id: user.id, role: 'viewer', name: googleName || null, email: googleEmail || null })

        if (insertError) {
          console.error('Failed to create role:', insertError)
          await supabase.auth.signOut()
          window.location.href = '/login?error=not_authorized'
          return
        }
        setUserRole('viewer')
      }

      setLoading(false)
    }

    init()
  }, [initialized, supabase])

  return (
    <AppContext.Provider value={{ user, userRole, isViewer, loading, lastError, clearError }}>
      {children}
    </AppContext.Provider>
  )
}
