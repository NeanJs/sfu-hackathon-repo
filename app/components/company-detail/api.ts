'use client'

// Functionality: API helper to fetch full company analysis

import type { CompanyFullAnalysis } from './types'

const API_ENDPOINT = '/api/full-analysis'

export async function fetchCompanyFullAnalysis(companyName: string): Promise<CompanyFullAnalysis | null> {
  if (!companyName || companyName.trim().length === 0) return null
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ companyName })
  })
  if (!res.ok) {
    return null
  }
  try {
    const data = (await res.json()) as CompanyFullAnalysis
    return data ?? null
  } catch {
    return null
  }
}


