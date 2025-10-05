'use client'

// Functionality: Render a single question field by type with mobile-first UI

import React from 'react'
import type { ChoiceQuestion, Question, TextQuestion } from './types'

interface FieldRendererProps {
  question: Question
  value: any
  onChange: (value: any) => void
  error?: string | null
}

export default function FieldRenderer({ question, value, onChange, error }: FieldRendererProps) {
  const baseLabel = (
    <div className="mb-2">
      <div className="flex items-baseline justify-between">
        <label className="text-base font-medium">
          {question.title}
          {question.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>
      {question.description && (
        <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
      )}
    </div>
  )

  const inputBaseClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition'

  const renderText = (q: TextQuestion) => {
    if (q.type === 'textarea') {
      return (
        <textarea
          className={`${inputBaseClass} min-h-[120px] resize-y`}
          placeholder={q.placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    }

    const type = q.type === 'number' ? 'number' : q.type === 'date' ? 'date' : 'text'
    return (
      <input
        type={type}
        className={inputBaseClass}
        placeholder={q.placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        min={q.min}
        max={q.max}
      />
    )
  }

  const renderChoice = (q: ChoiceQuestion) => {
    if (q.type === 'select') {
      return (
        <select
          className={inputBaseClass}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            Select an option
          </option>
          {q.options.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    if (q.type === 'radio') {
      return (
        <div className="space-y-2">
          {q.options.map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background/60 hover:bg-accent/40 cursor-pointer">
              <input
                type="radio"
                className="h-5 w-5"
                name={q.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      )
    }

    // checkbox
    const selected: string[] = Array.isArray(value) ? value : []
    const toggle = (val: string) => {
      const next = selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
      onChange(next)
    }
    return (
      <div className="space-y-2">
        {q.options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background/60 hover:bg-accent/40 cursor-pointer">
            <input
              type="checkbox"
              className="h-5 w-5"
              value={opt.value}
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <span className="text-sm font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <div>
      {baseLabel}
      {question.type === 'radio' || question.type === 'checkbox' || question.type === 'select'
        ? renderChoice(question as ChoiceQuestion)
        : renderText(question as TextQuestion)}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}


