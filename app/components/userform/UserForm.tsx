'use client'

// Functionality: UserForm - mobile-first multi-step form with ButtonBar integration

import React, { useEffect, useMemo, useState } from 'react'
import { fetchFormDefinition, submitFormResponse } from './api'
import FieldRenderer from './FieldRenderer'
import type { FormDefinition, FormResponse, FormValue, Question } from './types'
import { useButtonBarActions } from '../button-bar/ButtonBarProvider'

interface UserFormProps {
  formId: string
  initialValues?: Partial<FormResponse>
  onSubmitted?: (response: FormResponse) => void
  className?: string
}

export default function UserForm({ formId, initialValues, onSubmitted, className = '' }: UserFormProps) {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [def, setDef] = useState<FormDefinition | null>(null)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, FormValue>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchFormDefinition(formId).then((d) => {
      if (!mounted) return
      setDef(d)
      const initial: Record<string, FormValue> = {}
      d.questions.forEach((q) => {
        if (initialValues && q.id in initialValues) {
          initial[q.id] = initialValues[q.id] as FormValue
        } else if (q.type === 'checkbox') {
          initial[q.id] = []
        } else {
          initial[q.id] = ''
        }
      })
      setValues(initial)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [formId, initialValues])

  const steps = def?.steps ?? []
  const activeStep = steps[activeStepIndex]

  const questionsById = useMemo(() => {
    const map = new Map<string, Question>()
    def?.questions.forEach((q) => map.set(q.id, q))
    return map
  }, [def])

  const validateStep = (): boolean => {
    if (!activeStep) return true
    const nextErrors: Record<string, string> = {}
    activeStep.questionIds.forEach((qid) => {
      const q = questionsById.get(qid)
      if (!q) return
      const v = values[qid]
      if (q.required) {
        if (q.type === 'checkbox') {
          if (!Array.isArray(v) || v.length === 0) nextErrors[qid] = 'Required'
        } else if (v === null || v === undefined || v === '') {
          nextErrors[qid] = 'Required'
        }
      }
      if (q.type === 'number' && typeof v === 'number') {
        if (q.min !== undefined && v < q.min) nextErrors[qid] = `Min ${q.min}`
        if (q.max !== undefined && v > q.max) nextErrors[qid] = `Max ${q.max}`
      }
    })
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => {
    if (!validateStep()) return
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((i) => i - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setSubmitting(true)
    try {
      await submitFormResponse(def!.id, values)
      onSubmitted?.(values)
    } finally {
      setSubmitting(false)
    }
  }

  const canGoBack = activeStepIndex > 0
  const isLastStep = steps.length > 0 && activeStepIndex === steps.length - 1

  const buttonActions = useMemo(() => {
    if (loading || !def) return null
    const actions = [] as any[]
    actions.push({ id: 'back', label: 'Back', variant: 'secondary' as const, onClick: goBack, disabled: !canGoBack })
    if (isLastStep) {
      actions.push({ id: 'submit', label: submitting ? 'Submitting…' : 'Submit', onClick: handleSubmit, disabled: submitting })
    } else {
      actions.push({ id: 'next', label: 'Continue', onClick: goNext })
    }
    return actions
  }, [loading, def, canGoBack, isLastStep, submitting, values])

  useButtonBarActions(buttonActions)

  const setValue = (qid: string, v: FormValue) => {
    setValues((prev) => ({ ...prev, [qid]: v }))
    setErrors((prev) => {
      if (!prev[qid]) return prev
      const next = { ...prev }
      delete next[qid]
      return next
    })
  }

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="space-y-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          <div className="h-24 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!def) return null

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">{def.title}</h2>
          {def.description && <p className="text-muted-foreground">{def.description}</p>}
        </div>

        <div className="flex items-center justify-center gap-2">
          {steps.map((s, idx) => (
            <div key={s.id} className={[
              'h-2 rounded-full transition-all',
              idx === activeStepIndex ? 'bg-primary w-10' : 'bg-border w-6'
            ].join(' ')} />
          ))}
        </div>

        <div className="card-elevated p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{activeStep?.title}</h3>
            {activeStep?.description && (
              <p className="text-sm text-muted-foreground mt-1">{activeStep.description}</p>
            )}
          </div>

          <div className="space-y-6">
            {activeStep?.questionIds.map((qid) => {
              const q = questionsById.get(qid)
              if (!q) return null
              return (
                <FieldRenderer
                  key={qid}
                  question={q}
                  value={values[qid]}
                  onChange={(v) => setValue(qid, v)}
                  error={errors[qid]}
                />
              )
            })}
          </div>
        </div>
        <div className="pb-24" />
      </div>
    </div>
  )
}


