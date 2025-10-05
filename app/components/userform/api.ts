'use client'

// Functionality: Firebase-ready API stubs for fetching form definition and submitting responses

import type { FormDefinition, FormResponse } from './types'

export async function fetchFormDefinition(formId: string): Promise<FormDefinition> {
  // Placeholder for Firebase integration
  // Replace with Firestore call e.g., getDoc(doc(db, 'forms', formId))
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
  // Placeholder for Firebase integration
  // Replace with Firestore write e.g., addDoc(collection(db, 'responses', formId, 'entries'), response)
  await new Promise((r) => setTimeout(r, 300))
  return { ok: true }
}


