'use client'

import { auth } from '../../firebase.config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useMemo, useState } from 'react'
import { useButtonBarActions } from '../components/button-bar/ButtonBarProvider'
function AuthForm({ mode, onSubmit, loading }: { mode: 'login' | 'register'; onSubmit: (data: { email: string; password: string }) => void; loading?: boolean }) {
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (email && password) {
      onSubmit({ email, password })
    }
  }

  useButtonBarActions([
    {
      id: 'submit',
      label: loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign in' : 'Create account'),
      onClick: handleSubmit,
      disabled: loading || !email || !password,
      variant: 'primary'
    }
  ])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor={`${mode}-email`} className="block text-sm font-medium text-white/90 mb-2">
          Email Address
        </label>
        <input
          id={`${mode}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3.5 text-base text-white placeholder:text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={`${mode}-password`} className="block text-sm font-medium text-white/90 mb-2">
          Password
        </label>
        <input
          id={`${mode}-password`}
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3.5 text-base text-white placeholder:text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        />
        {mode === 'register' && (
          <p className="text-xs text-white/70 mt-1">
            Password must be at least 8 characters long
          </p>
        )}
      </div>
    </div>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log('Auth page loaded, auth instance:', auth)

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoginLoading(true)
    setError(null)

    try {
      console.log('Attempting to sign in with:', data.email)
      console.log('Auth instance:', auth)
      await signInWithEmailAndPassword(auth, data.email, data.password)
      console.log('User signed in successfully')
    } catch (error: any) {
      console.error('Sign in error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      setError(getAuthErrorMessage(error.code))
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (data: { email: string; password: string }) => {
    setRegisterLoading(true)
    setError(null)

    try {
      console.log('Attempting to create user with:', data.email)
      console.log('Auth instance:', auth)
      await createUserWithEmailAndPassword(auth, data.email, data.password)
      console.log('User created successfully')
    } catch (error: any) {
      console.error('Registration error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      setError(getAuthErrorMessage(error.code))
    } finally {
      setRegisterLoading(false)
    }
  }

  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      default:
        return 'Authentication failed. Please try again'
    }
  }

  const highlightStyle = useMemo(() => ({ left: mode === 'login' ? '4px' : 'calc(50% + 4px)' }), [mode])

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setError(null)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/40 via-purple-500/30 to-indigo-500/20" />
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-400/40 to-cyan-400/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-purple-400/40 to-pink-400/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-slide-up">
            <div className="mx-auto mb-6 h-16 w-16 rounded-3xl bg-gradient-to-br from-white/20 to-white/10 ring-2 ring-white/40 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 20l9-5-9-5-9 5 9 5z" />
                <path d="M12 12l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-2xl">
              Welcome to <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Leadger</span>
            </h1>
            <p className="mt-3 text-white/85 text-base">Sign in or create an account</p>
          </div>

          <div className="relative h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl p-1 mb-6 shadow-2xl">
            <div
              className="absolute top-1 h-10 rounded-full bg-white/20 ring-1 ring-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300"
              style={{ left: highlightStyle.left as string, width: 'calc(50% - 8px)' }}
            />
            <div className="relative grid h-full" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                aria-pressed={mode === 'login'}
                className={[
                  'relative z-10 rounded-full text-sm font-semibold transition-colors',
                  'text-white px-4 py-2',
                  'focus:outline-none'
                ].join(' ')}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                aria-pressed={mode === 'register'}
                className={[
                  'relative z-10 rounded-full text-sm font-semibold transition-colors',
                  'text-white px-4 py-2',
                  'focus:outline-none'
                ].join(' ')}
              >
                Create account
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 backdrop-blur-xl p-4 shadow-2xl">
              <div className="flex items-center space-x-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 flex-shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
            {mode === 'login' ? (
              <AuthForm mode="login" onSubmit={handleLogin} loading={loginLoading} />
            ) : (
              <AuthForm mode="register" onSubmit={handleRegister} loading={registerLoading} />
            )}
          </div>
        </div>
      </section>

      <div className="pb-16" />
    </div>
  )
}


