'use client'

import { useEffect, useState } from 'react'
import { Users, Shield } from 'lucide-react'
import type { UserRole } from '@/types'

// UserRole['role'] is the shared 'admin' | 'manager' | 'viewer' union from src/types.
type Role = UserRole['role']

interface AppUser {
  user_id: string
  role: Role
  name: string | null
  email: string | null
  created_at: string
}

interface UsersTableProps {
  canEdit: boolean
  currentUserId: string
}

export default function UsersTable({ canEdit, currentUserId }: UsersTableProps) {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      const { data } = await supabase.from('app_roles').select('*').order('created_at', { ascending: true })
      if (data) setUsers(data)
      setLoadingUsers(false)
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setError('')
    const prev = users
    setUsers(users.map(u => (u.user_id === userId ? { ...u, role: newRole } : u)))
    const { createClient } = await import('@/lib/supabase')
    const supabase = createClient()
    // PostgREST returns success with an EMPTY ARRAY (not an error) when RLS blocks
    // the update, so we MUST chain .select() and check data.length to detect it.
    const { data, error } = await supabase.from('app_roles').update({ role: newRole }).eq('user_id', userId).select('user_id')
    if (error || !data?.length) {
      setUsers(prev)
      setError('Could not update role. Check your permissions and try again.')
    }
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>User Management</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage user roles and access</p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          {error}
        </div>
      )}

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
                    {canEdit ? (
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.user_id, e.target.value as Role)}
                        disabled={u.user_id === currentUserId}
                        title={u.user_id === currentUserId ? "You can't change your own role" : undefined}
                        className="text-sm rounded-md border px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      >
                        <option value="admin">admin</option>
                        <option value="manager">manager</option>
                        <option value="viewer">viewer</option>
                      </select>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" style={{ color: u.role === 'admin' ? '#f59e0b' : 'var(--text-muted)' }} />
                        <span className="capitalize" style={{ color: 'var(--text-primary)' }}>{u.role}</span>
                      </span>
                    )}
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
