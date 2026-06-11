import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  // Resolves the role-fetch on mount: from().select().order()
  order: vi.fn(),
  // Resolves a role update: from().update().eq().select()
  updateSelect: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        // fetch path: .select('*').order(...)
        order: mocks.order,
      }),
      update: () => ({
        eq: () => ({
          // update path: .update().eq().select('user_id')
          select: mocks.updateSelect,
        }),
      }),
    }),
  }),
}))

import UsersTable from '@/app/users/UsersTable'

const seedUsers = [
  { user_id: 'me', role: 'admin', name: 'Me Admin', email: 'me@example.com', created_at: '2024-01-01' },
  { user_id: 'u2', role: 'viewer', name: 'Vee Viewer', email: 'vee@example.com', created_at: '2024-01-02' },
]

beforeEach(() => {
  mocks.order.mockReset()
  mocks.updateSelect.mockReset()
  mocks.order.mockResolvedValue({ data: seedUsers, error: null })
})

describe('UsersTable', () => {
  it('manager view (canEdit=false) renders no role <select>', async () => {
    render(<UsersTable canEdit={false} currentUserId="me" />)

    await screen.findByText('Me Admin')
    expect(screen.queryByRole('combobox')).toBeNull()
    // Read-only roles still shown.
    expect(screen.getByText('admin')).toBeTruthy()
    expect(screen.getByText('viewer')).toBeTruthy()
  })

  it('admin view (canEdit=true) renders selects and disables the current user row', async () => {
    render(<UsersTable canEdit={true} currentUserId="me" />)

    await screen.findByText('Me Admin')
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[]
    expect(selects).toHaveLength(2)

    // First row is the current user ('me') and must be disabled.
    expect(selects[0].disabled).toBe(true)
    expect(selects[0].title).toBe("You can't change your own role")
    // Other row is editable.
    expect(selects[1].disabled).toBe(false)
  })

  it('successful role change shows the new role', async () => {
    mocks.updateSelect.mockResolvedValue({ data: [{ user_id: 'u2' }], error: null })
    render(<UsersTable canEdit={true} currentUserId="me" />)

    await screen.findByText('Me Admin')
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[]
    fireEvent.change(selects[1], { target: { value: 'manager' } })

    await waitFor(() => expect(selects[1].value).toBe('manager'))
    expect(screen.queryByText('Could not update role. Check your permissions and try again.')).toBeNull()
  })

  it('RLS-blocked update (empty array) rolls back and shows the error alert', async () => {
    mocks.updateSelect.mockResolvedValue({ data: [], error: null })
    render(<UsersTable canEdit={true} currentUserId="me" />)

    await screen.findByText('Me Admin')
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[]
    expect(selects[1].value).toBe('viewer')

    fireEvent.change(selects[1], { target: { value: 'manager' } })

    // Error alert appears and the role rolls back to the original value.
    await screen.findByText('Could not update role. Check your permissions and try again.')
    expect(selects[1].value).toBe('viewer')
  })
})
