'use client'

// Functionality: API adapter for UserForm (supports onboarding via /api/onboarding)

import type { FormDefinition, FormResponse } from './types'

export async function fetchFormDefinition(formId: string): Promise<FormDefinition> {
  if (formId === 'onboarding') {
    const res = await fetch('/api/onboarding', { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load onboarding survey')
    const questions = await res.json() as Array<{
      key: string
      question: string
      options: Array<{ value: string; label: string; pmv?: string }>
    }>

    const mappedQuestions = questions.map((q) => ({
      id: q.key,
      type: 'radio' as const,
      title: q.question,
      required: true,
      options: q.options.map((o) => ({ id: o.value, label: o.label, value: o.value }))
    }))

    const steps = questions.map((q, idx) => ({
      id: `step-${idx + 1}`,
      title: `Question ${idx + 1}`,
      questionIds: [q.key]
    }))

    return {
      id: formId,
      title: 'Welcome Survey',
      description: 'Answer a few quick questions to personalize your experience',
      steps,
      questions: mappedQuestions
    }
  }

  await new Promise((r) => setTimeout(r, 200))
  return {
    id: formId,
    title: 'User Information',
    description: 'Tell us a bit about yourself',
    steps: [
      { id: 'step-1', title: 'Basics', questionIds: ['q_name', 'q_email', 'q_age'] },
      { id: 'step-2', title: 'Preferences', questionIds: ['q_contact', 'q_topics'] },
      { id: 'step-3', title: 'More', questionIds: ['q_bio', 'q_date'] }
    ],
    questions: [
      { id: 'q_name', type: 'text', title: 'Full name', required: true, placeholder: 'John Doe' },
      { id: 'q_email', type: 'text', title: 'Email', required: true, placeholder: 'you@example.com' },
      { id: 'q_age', type: 'number', title: 'Age', min: 0, max: 120, placeholder: '25' },
      {
        id: 'q_contact',
        type: 'radio',
        title: 'Preferred contact method',
        required: true,
        options: [
          { id: 'email', label: 'Email', value: 'email' },
          { id: 'phone', label: 'Phone', value: 'phone' },
          { id: 'sms', label: 'SMS', value: 'sms' }
        ]
      },
      {
        id: 'q_topics',
        type: 'checkbox',
        title: 'Topics you are interested in',
        options: [
          { id: 'tech', label: 'Technology', value: 'tech' },
          { id: 'design', label: 'Design', value: 'design' },
          { id: 'business', label: 'Business', value: 'business' }
        ]
      },
      { id: 'q_bio', type: 'textarea', title: 'Short bio', placeholder: 'I am a ...' },
      { id: 'q_date', type: 'date', title: 'Preferred meeting date' }
    ]
  }
}

export async function submitFormResponse(formId: string, response: FormResponse) {
  if (formId === 'onboarding') {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    })
    if (!res.ok) throw new Error('Failed to submit onboarding survey')
    return await res.json()
  }
  await new Promise((r) => setTimeout(r, 300))
  return { ok: true }
}


