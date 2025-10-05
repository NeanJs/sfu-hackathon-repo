'use client'

// Functionality: Fullscreen card-like overlay container with sticky header and close

import React, { useEffect, useRef } from 'react'
import type { CardOverlayProps } from './types'

export default function CardOverlay({
  isOpen,
  onClose,
  title,
  headerRight,
  children,
  footer,
  className = '',
  contentClassName = '',
  closeLabel = 'Close',
  ariaLabel = 'Overlay dialog'
}: CardOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  console.log('CardOverlay render:', { isOpen, title, children: !!children })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch justify-center p-0 sm:p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div ref={containerRef} className={`relative w-full mx-auto flex flex-col bg-background border border-border rounded-none sm:rounded-2xl shadow-hard max-h-[100dvh] sm:max-h-[90vh] animate-scale-in overflow-hidden ${className}`}>
        <header className="sticky top-0 z-10 bg-background border-b border-border flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-t-none sm:rounded-t-2xl">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base sm:text-lg font-semibold truncate">{title}</h3>
            )}
          </div>
          {headerRight && (
            <div className="shrink-0 flex items-center gap-2">
              {headerRight}
            </div>
          )}
          <button
            onClick={onClose}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            aria-label={closeLabel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            <span className="hidden sm:inline text-sm">{closeLabel}</span>
          </button>
        </header>

        <div className={`flex-1 overflow-y-auto px-3 py-3 sm:p-4 ${contentClassName}`}>
          {children}
        </div>

        {footer && (
          <footer className="sticky bottom-0 bg-background border-t border-border px-3 py-2 sm:px-4 sm:py-3 rounded-b-none sm:rounded-b-2xl">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}


