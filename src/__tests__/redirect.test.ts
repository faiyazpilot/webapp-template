import { describe, it, expect } from 'vitest'
import { getSafeRedirectPath } from '@/lib/redirect'

describe('getSafeRedirectPath', () => {
  it('falls back to /dashboard when next is missing', () => {
    expect(getSafeRedirectPath(null)).toBe('/dashboard')
  })

  it('allows a simple same-origin path', () => {
    expect(getSafeRedirectPath('/settings')).toBe('/settings')
  })

  it('preserves query strings on same-origin paths', () => {
    expect(getSafeRedirectPath('/dashboard?tab=1')).toBe('/dashboard?tab=1')
  })

  it.each([
    '//evil.com', // protocol-relative
    '/\\evil.com', // slash-backslash trick
    'https://evil.com', // absolute URL
    '.evil.com', // host-suffix trick when concatenated to origin
    'javascript:alert(1)', // scheme injection
    '', // empty string
  ])('blocks %j', (input) => {
    expect(getSafeRedirectPath(input)).toBe('/dashboard')
  })
})
