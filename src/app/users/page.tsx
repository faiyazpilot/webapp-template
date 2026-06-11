import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import UsersTable from './UsersTable'

export default async function UsersPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data } = await supabase.from('app_roles').select('role').eq('user_id', user.id).maybeSingle()
  if (data?.role !== 'admin' && data?.role !== 'manager') redirect('/dashboard')
  return <UsersTable canEdit={data.role === 'admin'} currentUserId={user.id} />
}
