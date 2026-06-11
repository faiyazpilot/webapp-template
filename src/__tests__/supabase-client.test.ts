import { describe, it, expect, vi, afterEach } from 'vitest'
import { createClient } from '@/lib/supabase'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('createClient', () => {
  it('returns a working client when both env vars are set', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

    const client = createClient()

    expect(client).toBeTruthy()
    expect(typeof client.from).toBe('function')
  })

  it('throws in the browser when env vars are missing', () => {
    // jsdom means typeof window !== 'undefined', so the browser branch runs.
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    expect(() => createClient()).toThrow()
  })
})
