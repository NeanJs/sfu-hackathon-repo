'use client'

// Functionality: Fullscreen Spotlight-like search overlay

import React, { useEffect, useRef } from 'react'
import { useSearchOverlay } from './SearchOverlayProvider'

export default function SearchOverlay() {
  const { isOpen, query, setQuery, close } = useSearchOverlay()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={close} />
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="glass rounded-2xl shadow-hard">
          <div className="flex items-center gap-2 p-2 md:p-3">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 text-white/80 backdrop-blur-sm">⌘</div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search functions and pages..."
              className="flex-1 bg-transparent outline-none text-base md:text-lg px-2 text-white placeholder-white/60"
              aria-label="Search"
            />
            <button onClick={close} className="px-3 py-1 text-sm rounded-lg border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm">Esc</button>
          </div>

          <div className="max-h-[55vh] overflow-y-auto divide-y divide-white/10">
            <div className="p-3 text-sm text-white/60">No results yet. Start typing...</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/60 sm:flex sm:flex-wrap sm:items-center">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="hidden sm:inline">Open</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">↩</kbd>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="hidden sm:inline">Close</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">Esc</kbd>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="hidden sm:inline">Open search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">K</kbd>
          </div>
        </div>
      </div>
    </div>
  )
}


