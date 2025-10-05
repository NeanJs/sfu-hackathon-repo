'use client'

// Functionality: Search Overlay provider

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface SearchOverlayContextValue {
  isOpen: boolean
  query: string
  open: () => void
  close: () => void
  toggle: () => void
  setQuery: (q: string) => void
}

const SearchOverlayContext = createContext<SearchOverlayContextValue | null>(null)

export function SearchOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  const value = useMemo(
    () => ({ isOpen, query, open, close, toggle, setQuery }),
    [isOpen, query, open, close, toggle]
  )

  return (
    <SearchOverlayContext.Provider value={value}>
      {children}
    </SearchOverlayContext.Provider>
  )
}

export function useSearchOverlay() {
  const ctx = useContext(SearchOverlayContext)
  if (!ctx) throw new Error('useSearchOverlay must be used within SearchOverlayProvider')
  return ctx
}


