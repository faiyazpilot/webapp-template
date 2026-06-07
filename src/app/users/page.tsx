'use client'

import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Shield } from 'lucide-react'

interface AppUser {
  user_id: string
  role: string
  name: string | null
  email: string | null
  created_at: string
}

export default function UsersPage() {
  const { userRole, loading } = useApp()
  const router = useRouter()
  const [users, setUsers] = useState<AppUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    if (!loading && userRole !== 'admin' && userRole !== 'manager') {
      router.replace('/dashboard')
    }
  }, [userRole, loading, router])

  useEffect(() => {
    if (loading || (userRole !== 'admin' && userRole !== 'manager')) return
    const fetchUsers = async () => {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      const { data } = await supabase.from('app_roles').select('*').order('created_at', { ascending: true })
      if (data) setUsers(data)
      setLoadingUsers(false)
    }
    fetchUsers()
  }, [loading, userRole])

  if (loading || (userRole !== 'admin' && userRole !== 'manager')) return null

  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>User Management</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage user roles and access</p>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        {loadingUsers ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="w-12 h-12 mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No users yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Users will appear here after they sign in</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Name</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Email</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{u.name || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{u.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" style={{ color: u.role === 'admin' ? '#f59e0b' : 'var(--text-muted)' }} />
                      <span className="capitalize" style={{ color: 'var(--text-primary)' }}>{u.role}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
