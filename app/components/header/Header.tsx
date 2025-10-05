'use client'

// Functionality: Responsive top header with logo (mobile centered) and desktop links

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NAV_LINKS from '../nav/links'
import { useSearchOverlay } from '../search-overlay/SearchOverlayProvider'

export default function Header() {
  const pathname = usePathname()
  const { open } = useSearchOverlay()

  const links = useMemo(() => NAV_LINKS, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700/40 bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl shadow-lg">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 select-none">
            <Image src="/images/LeadgerCropHeader.png" alt="Leadger" width={222} height={48} priority className="h-8 md:h-12 w-auto" />
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2" aria-label="Primary">
              {links.map(link => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={[
                      'px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                      isActive ? 'text-white bg-white/20 shadow-md' : 'text-white/90 hover:text-white hover:bg-white/15 hover:shadow-sm'
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
            
            <button
              onClick={open}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Open search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}


