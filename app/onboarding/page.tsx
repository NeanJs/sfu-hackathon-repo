'use client'

// Functionality: Full-screen onboarding with welcome step and survey form

import React, { useMemo, useState } from 'react'
import { UserForm } from '@/app/components/userform'
import { useButtonBarActions } from '@/app/components/button-bar/ButtonBarProvider'
import Link from 'next/link'

export default function OnboardingPage() {
  const [step, setStep] = useState<'welcome' | 'form' | 'done'>('welcome')
  const [submitted, setSubmitted] = useState(false)

  const actions = useMemo(() => {
    if (step === 'welcome') {
      return [
        { id: 'get-started', label: 'Get Started', onClick: () => {
          setStep('form')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      ]
    }
    if (step === 'done') {
      return [
        { id: 'explore', label: 'Start Exploring', onClick: () => {}, disabled: true }
      ]
    }
    return null
  }, [step])

  useButtonBarActions(actions)

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

      {step === 'welcome' && (
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <div className="mx-auto mb-8 h-20 w-20 rounded-3xl bg-gradient-to-br from-white/20 to-white/10 ring-2 ring-white/40 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 20l9-5-9-5-9 5 9 5z"/>
                <path d="M12 12l9-5-9-5-9 5 9 5z"/>
              </svg>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-2xl mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Transparency Ledger</span>
            </h1>
            <p className="mt-6 text-white/90 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Answer a few quick questions so we can personalize company insights to your values and preferences.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => {
                setStep('form')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }} className="group relative rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-lg font-bold shadow-[0_12px_32px_rgba(59,130,246,0.4)] hover:shadow-[0_16px_40px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="relative z-10">Get Started</span>
              </button>
              <Link href="/" className="rounded-full border-2 border-white/40 text-white px-8 py-4 text-lg font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-200 backdrop-blur-sm">
                Skip for now
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="group rounded-3xl border border-white/30 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="text-white font-bold text-lg">Personalized</div>
                </div>
                <div className="text-white/85 text-sm leading-relaxed">Tailored company lists matched to your values and preferences.</div>
              </div>
              <div className="group rounded-3xl border border-white/30 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <div className="text-white font-bold text-lg">Effortless</div>
                </div>
                <div className="text-white/85 text-sm leading-relaxed">Just a few quick questions to get started - no lengthy forms.</div>
              </div>
              <div className="group rounded-3xl border border-white/30 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div className="text-white font-bold text-lg">Private</div>
                </div>
                <div className="text-white/85 text-sm leading-relaxed">Your preferences help personalize your feed while staying private.</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 'form' && (
        <section className="relative min-h-screen px-4 pt-20 pb-32">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Quick Survey</h2>
              <p className="text-white/80 text-lg">Help us understand your preferences</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <UserForm
                formId="onboarding"
                onSubmitted={() => {
                  setSubmitted(true)
                  setStep('done')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          </div>
        </section>
      )}

      {step === 'done' && (
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-2xl text-center">
            <div className="mx-auto mb-8 h-20 w-20 rounded-3xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 ring-2 ring-green-400/40 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-300">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-2xl mb-6">
              You're <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">all set</span>
            </h2>
            <p className="mt-6 text-white/90 text-lg sm:text-xl font-medium max-w-xl mx-auto leading-relaxed mb-12">
              We've saved your preferences. Now you can explore companies tailored to your values and interests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/" className="group relative rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 text-lg font-bold shadow-[0_12px_32px_rgba(34,197,94,0.4)] hover:shadow-[0_16px_40px_rgba(34,197,94,0.5)] active:scale-95 transition-all duration-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="relative z-10">Start Exploring</span>
              </Link>
            </div>
          </div>
        </section>
      )}
      <div className="pb-24" />
    </div>
  )
}


