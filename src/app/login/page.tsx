'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { APP_NAME } from '@/lib/appConfig'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [runtimeError, setRuntimeError] = useState('')
  const searchParams = useSearchParams()

  const supabase = createClient()

  const paramError = useMemo(() => {
    const e = searchParams.get('error')
    if (e === 'not_authorized') return 'Your account is not authorized. Contact an administrator.'
    if (e === 'auth_failed') return 'Authentication failed. Please try again.'
    if (e === 'config_missing') return 'App configuration error. Contact support.'
    if (e === 'role_missing') return 'Your account is not set up yet. If you are the developer, re-run supabase-schema.sql (see README).'
    return ''
  }, [searchParams])

  const error = runtimeError || paramError

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setRuntimeError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setRuntimeError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-2xl p-8 w-full max-w-md" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center mb-8">
          {/* Placeholder logo */}
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">{APP_NAME.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{APP_NAME}</h1>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Sign in to continue</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border-2 font-medium py-3 px-4 rounded-lg transition mb-4 disabled:opacity-50"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {error && (
          <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Contact an administrator if you need access.
        </p>
      </div>
    </div>
  )
}
