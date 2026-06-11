import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  signOut: vi.fn(),
  maybeSingle: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: { getUser: mocks.getUser, signOut: mocks.signOut },
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: mocks.maybeSingle }),
      }),
    }),
  }),
}))

import { AppProvider, useApp } from '@/context/AppContext'

function Consumer() {
  const { userRole, loading } = useApp()
  return <div data-testid="state">{loading ? 'loading' : userRole}</div>
}

let locationMock: { pathname: string; href: string }

beforeEach(() => {
  vi.useFakeTimers()
  mocks.getUser.mockReset()
  mocks.signOut.mockReset()
  mocks.maybeSingle.mockReset()
  mocks.signOut.mockResolvedValue({ error: null })
  locationMock = { pathname: '/dashboard', href: '' }
  Object.defineProperty(window, 'location', {
    writable: true,
    configurable: true,
    value: locationMock,
  })
})

afterEach(() => {
  vi.useRealTimers()
})

// Flush pending promises (and any 0ms timers) inside act.
const flush = async () => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0)
  })
}

describe('AppContext role flow', () => {
  it('shows the role when the row exists, without signing out', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mocks.maybeSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })

    render(<AppProvider><Consumer /></AppProvider>)
    await flush()

    expect(screen.getByTestId('state').textContent).toBe('admin')
    expect(mocks.signOut).not.toHaveBeenCalled()
  })

  it('retries when the trigger lags, then finds the role', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mocks.maybeSingle
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: { role: 'manager' }, error: null })

    render(<AppProvider><Consumer /></AppProvider>)
    await flush()
    expect(screen.getByTestId('state').textContent).toBe('loading')

    // First retry happens after 700ms.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByTestId('state').textContent).toBe('manager')
    expect(mocks.maybeSingle).toHaveBeenCalledTimes(2)
    expect(mocks.signOut).not.toHaveBeenCalled()
  })

  it('signs out with role_missing after all three attempts fail', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null })

    render(<AppProvider><Consumer /></AppProvider>)
    await flush()
    // Retry delays: 700ms then 1400ms.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1400)
    })
    await flush()

    expect(mocks.maybeSingle).toHaveBeenCalledTimes(3)
    expect(mocks.signOut).toHaveBeenCalledTimes(1)
    expect(locationMock.href).toContain('error=role_missing')
  })

  it('redirects to /login when there is no user on a non-auth page', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } })

    render(<AppProvider><Consumer /></AppProvider>)
    await flush()

    expect(locationMock.href).toBe('/login')
    expect(mocks.maybeSingle).not.toHaveBeenCalled()
  })
})
