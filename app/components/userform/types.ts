'use client'

// Functionality: Types for user form questions and responses

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'number'
  | 'date'

export interface QuestionOption {
  id: string
  label: string
  value: string
}

export interface QuestionBase {
  id: string
  title: string
  description?: string
  required?: boolean
}

export interface TextQuestion extends QuestionBase {
  type: 'text' | 'textarea' | 'number' | 'date'
  placeholder?: string
  min?: number
  max?: number
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'radio' | 'checkbox' | 'select'
  options: QuestionOption[]
}

export type Question = TextQuestion | ChoiceQuestion

export interface FormDefinition {
  id: string
  title: string
  description?: string
  steps: {
    id: string
    title: string
    description?: string
    questionIds: string[]
  }[]
  questions: Question[]
}

export type FormValue = string | number | boolean | string[] | null

export type FormResponse = Record<string, FormValue>


