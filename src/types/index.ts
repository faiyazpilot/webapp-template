export interface UserRole {
  user_id: string
  role: 'admin' | 'manager' | 'viewer'
  name: string | null
  email: string | null
  created_at: string
}
