// Only allow redirects to same-origin paths.
// Blocks "https://evil.com", "//evil.com" (protocol-relative), "/\evil.com"
// (backslash trick), and ".evil.com" (host-suffix trick when concatenated).
export function getSafeRedirectPath(raw: string | null): string {
  if (raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\')) {
    return raw
  }
  return '/dashboard'
}
