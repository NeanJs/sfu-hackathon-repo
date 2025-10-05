'use client'

// Functionality: Local storage cache management for company details with 2-hour expiration

import type { CompanyFullAnalysis } from './types'

const CACHE_PREFIX = 'company_detail_'
const CACHE_EXPIRY_HOURS = 2
const CACHE_EXPIRY_MS = CACHE_EXPIRY_HOURS * 60 * 60 * 1000

interface CacheEntry {
  data: CompanyFullAnalysis
  timestamp: number
}

function getCacheKey(companyName: string): string {
  return `${CACHE_PREFIX}${companyName.toLowerCase().trim()}`
}

function isCacheExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_EXPIRY_MS
}

export function getCachedCompanyDetail(companyName: string): CompanyFullAnalysis | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cacheKey = getCacheKey(companyName)
    const cached = localStorage.getItem(cacheKey)
    
    if (!cached) return null
    
    const entry: CacheEntry = JSON.parse(cached)
    
    if (isCacheExpired(entry.timestamp)) {
      localStorage.removeItem(cacheKey)
      return null
    }
    
    return entry.data
  } catch {
    return null
  }
}

export function setCachedCompanyDetail(companyName: string, data: CompanyFullAnalysis): void {
  if (typeof window === 'undefined') return
  
  try {
    const cacheKey = getCacheKey(companyName)
    const entry: CacheEntry = {
      data,
      timestamp: Date.now()
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(entry))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function clearCompanyDetailCache(companyName?: string): void {
  if (typeof window === 'undefined') return
  
  try {
    if (companyName) {
      const cacheKey = getCacheKey(companyName)
      localStorage.removeItem(cacheKey)
    } else {
      // Clear all company detail caches
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    }
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function getCacheInfo(companyName: string): { exists: boolean; isExpired: boolean; age?: number } {
  if (typeof window === 'undefined') return { exists: false, isExpired: false }
  
  try {
    const cacheKey = getCacheKey(companyName)
    const cached = localStorage.getItem(cacheKey)
    
    if (!cached) return { exists: false, isExpired: false }
    
    const entry: CacheEntry = JSON.parse(cached)
    const age = Date.now() - entry.timestamp
    const expired = isCacheExpired(entry.timestamp)
    
    return { exists: true, isExpired: expired, age }
  } catch {
    return { exists: false, isExpired: false }
  }
}
