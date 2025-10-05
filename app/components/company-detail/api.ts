'use client'

// Functionality: API helper to fetch full company analysis with local storage caching

import type { CompanyFullAnalysis } from './types'
import { getCachedCompanyDetail, setCachedCompanyDetail } from './cache'

const API_ENDPOINT = '/api/full-analysis'

export async function fetchCompanyFullAnalysis(companyName: string): Promise<CompanyFullAnalysis | null> {
  if (!companyName || companyName.trim().length === 0) return null
  
  // Check cache first
  const cachedData = getCachedCompanyDetail(companyName)
  if (cachedData) {
    return cachedData
  }
  
  // Fetch from API if not in cache
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
    if (data) {
      // Cache the fetched data
      setCachedCompanyDetail(companyName, data)
    }
    return data ?? null
  } catch {
    return null
  }
}


