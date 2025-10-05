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
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-purple-600/20 to-transparent" />
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {step === 'welcome' && (
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-2xl text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-white/10 ring-1 ring-white/30 backdrop-blur-md flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/90">
                <path d="M12 20l9-5-9-5-9 5 9 5z"/>
                <path d="M12 12l9-5-9-5-9 5 9 5z"/>
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow">Welcome to Transparency Ledger</h1>
            <p className="mt-4 text-white/80 text-base sm:text-lg">Answer a few quick questions so we can personalize company insights to your views.</p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button onClick={() => {
                setStep('form')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }} className="rounded-full bg-white text-gray-900 px-6 py-3 text-base font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)] active:scale-95 transition">
                Get Started
              </button>
              <Link href="/" className="rounded-full border border-white/30 text-white/90 px-6 py-3 text-base font-semibold hover:bg-white/10 transition">
                Skip for now
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4">
                <div className="text-white font-semibold">Personalized</div>
                <div className="text-white/75 text-sm">Tailored company lists matched to your values.</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4">
                <div className="text-white font-semibold">Effortless</div>
                <div className="text-white/75 text-sm">Just a few questions to get started.</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4">
                <div className="text-white font-semibold">Private</div>
                <div className="text-white/75 text-sm">Your preferences help personalize your feed.</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 'form' && (
        <section className="relative min-h-screen px-4 pt-16">
          <div className="mx-auto max-w-2xl">
            <UserForm
              formId="onboarding"
              onSubmitted={() => {
                setSubmitted(true)
                setStep('done')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        </section>
      )}

      {step === 'done' && (
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">You're all set</h2>
            <p className="mt-3 text-white/80">We saved your preferences. Explore companies tailored to you.</p>
            <div className="mt-8">
              <Link href="/" className="rounded-full bg-white text-gray-900 px-6 py-3 text-base font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)] active:scale-95 transition">
                Start Exploring
              </Link>
            </div>
          </div>
        </section>
      )}
      <div className="pb-24" />
    </div>
  )
}


