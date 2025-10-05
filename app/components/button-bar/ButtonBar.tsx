'use client'

// Functionality: Fixed bottom responsive button bar

import React from 'react'
import { usePathname } from 'next/navigation'
import { useButtonBar } from './ButtonBarProvider'

export default function ButtonBar() {
  const { actions } = useButtonBar()
  const pathname = usePathname()

  if (!actions || actions.length === 0) return null

  // Hide tab bar on onboarding page, so button bar should be at bottom with safe space
  const isTabBarHidden = pathname === '/onboarding'
  const bottomPosition = isTabBarHidden ? 'bottom-4' : 'bottom-20 sm:bottom-24'

  return (
    <div className={`pointer-events-none fixed inset-x-0 ${bottomPosition} z-50 flex items-end justify-center p-3 md:p-4`} style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}>
      <div className="pointer-events-auto w-full max-w-[720px]">
        <div className="relative rounded-full border border-black/10 bg-black/20 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-px rounded-[999px] bg-gradient-to-b from-white/5 to-white/2 z-0" />
          <div className={['relative z-10 grid gap-2 md:gap-3 px-2 md:px-3', 'py-1 md:py-2'].join(' ')} style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}>
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={a.disabled}
                onClick={() => a.onClick(a.data)}
                className={[
                  'w-full rounded-full text-sm md:text-base font-medium transition-all duration-200',
                  'px-2 md:px-3 py-1 md:py-2',
                  a.variant === 'secondary'
                    ? 'bg-secondary/80 text-secondary-foreground border border-white/20 hover:bg-secondary hover:border-white/30 backdrop-blur-sm'
                    : 'bg-primary/80 text-primary-foreground border border-white/20 hover:bg-primary hover:border-white/30 backdrop-blur-sm',
                  a.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
                ].join(' ')}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


