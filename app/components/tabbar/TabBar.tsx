'use client'

// Functionality: Liquid glass bottom tab bar with sliding highlight and Search FAB

import React, { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSearchOverlay } from '../search-overlay/SearchOverlayProvider'

interface TabItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

export default function TabBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { open } = useSearchOverlay()

  const tabs = useMemo<TabItem[]>(() => [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11l9-8 9 8"/>
          <path d="M9 22V12h6v10"/>
        </svg>
      )
    },
    {
      id: 'demo',
      label: 'Demo',
      href: '/demo',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="2"/>
          <rect x="14" y="3" width="7" height="7" rx="2"/>
          <rect x="14" y="14" width="7" height="7" rx="2"/>
          <rect x="3" y="14" width="7" height="7" rx="2"/>
        </svg>
      )
    }
  ], [])

  const activeIndex = useMemo(() => Math.max(0, tabs.findIndex(t => pathname === t.href || pathname?.startsWith(t.href + '/'))), [pathname, tabs])
  const [highlightStyle, setHighlightStyle] = useState<{ left: string; width: string }>({ left: '0%', width: `${100 / tabs.length}%` })

  useEffect(() => {
    const widthPct = 100 / tabs.length
    setHighlightStyle({ left: `${activeIndex * widthPct}%`, width: `${widthPct}%` })
  }, [activeIndex, tabs.length])

  const onTabClick = (href: string) => {
    if (pathname !== href) router.push(href)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-center px-3 sm:px-4" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="pointer-events-auto relative w-full max-w-[720px]">
        <div className="relative h-[72px] sm:h-[72px] rounded-full border border-black/10 bg-black/20 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-px rounded-[999px] bg-gradient-to-b from-white/5 to-white/2 z-0" />

          <div className="relative h-full flex items-center justify-between px-2">
            <div className="relative flex-1">
              <div className="absolute top-1/2 -translate-y-1/2 h-[52px] sm:h-[56px] rounded-full bg-white/30 ring-1 ring-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 z-10" style={{ left: highlightStyle.left, width: highlightStyle.width }} />

              <nav className="relative z-20 grid h-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }} aria-label="Primary">
                {tabs.map((tab, idx) => {
                  const isActive = idx === activeIndex
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onTabClick(tab.href)}
                      className={[
                        'group relative mx-1 my-2 flex items-center justify-center gap-2 rounded-full select-none',
                        'text-sm font-medium transition-colors duration-200',
                        isActive ? 'text-white' : 'text-white/70 hover:text-white'
                      ].join(' ')}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className={[
                        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                        isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/10'
                      ].join(' ')}>
                        {tab.icon}
                      </span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="relative ml-2">
              <button
                type="button"
                onClick={open}
                aria-label="Search"
                className="h-14 w-14 rounded-full border border-black/20 bg-black/20 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:scale-[1.03] active:scale-95 transition-transform duration-150"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/90 mx-auto">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


