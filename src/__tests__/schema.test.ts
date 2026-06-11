import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Vitest runs from the project root.
const sql = readFileSync(resolve(process.cwd(), 'supabase-schema.sql'), 'utf8')

describe('supabase-schema.sql (v2 security invariants)', () => {
  it('uses security definer for the helper and trigger functions', () => {
    const count = (sql.toLowerCase().match(/security definer/g) ?? []).length
    expect(count).toBeGreaterThanOrEqual(3)
  })

  it('pins an empty search_path on definer functions', () => {
    expect(sql).toContain("set search_path = ''")
  })

  it('creates the new-user trigger', () => {
    expect(sql).toContain('on_auth_user_created')
  })

  it('drops the v1 self-serve insert policy', () => {
    expect(sql).toContain('drop policy if exists "users_insert_own_role"')
  })

  it('has no recursive app_roles subquery inside any policy body', () => {
    // The SECURITY DEFINER helper functions legitimately query app_roles —
    // only the policy statements themselves must not (v1 recursion bug, 42P17).
    const normalized = sql.replace(/\s+/g, ' ')
    const segments = normalized.split('create policy').slice(1)
    expect(segments.length).toBeGreaterThan(0)
    for (const segment of segments) {
      // Each policy statement ends at the next semicolon.
      const statement = segment.slice(0, segment.indexOf(';'))
      expect(statement).not.toContain('from app_roles where')
      expect(statement).not.toContain('from public.app_roles where')
    }
  })
})
