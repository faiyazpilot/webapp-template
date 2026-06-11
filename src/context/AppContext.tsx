'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from 'react'
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
  const initializedRef = useRef(false)
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
    if (initializedRef.current) return
    initializedRef.current = true

    // The DB trigger creates the role row at signup, but it can lag the very
    // first page load by a moment — retry briefly before giving up.
    const fetchRole = async (userId: string): Promise<string | null> => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data, error } = await supabase
          .from('app_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle()
        if (data?.role) return data.role
        if (error) console.error('Role fetch failed:', error.message)
        if (attempt < 2) await new Promise(r => setTimeout(r, 700 * (attempt + 1)))
      }
      return null
    }

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

      // Roles are created by a DB trigger at signup — the browser only reads.
      const role = await fetchRole(user.id)

      if (!role) {
        await supabase.auth.signOut()
        window.location.href = '/login?error=role_missing'
        return
      }

      setUserRole(role)
      setLoading(false)
    }

    init()
  }, [supabase])

  return (
    <AppContext.Provider value={{ user, userRole, isViewer, loading, lastError, clearError }}>
      {children}
    </AppContext.Provider>
  )
}
