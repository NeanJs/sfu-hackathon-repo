'use client'

// Functionality: Fixed bottom responsive button bar

import React from 'react'
import { useButtonBar } from './ButtonBarProvider'

export default function ButtonBar() {
  const { actions } = useButtonBar()

  if (!actions || actions.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-center p-3 md:p-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}>
      <div className="pointer-events-auto w-full">
        <div className="rounded-2xl border border-border bg-background/80 backdrop-blur-md shadow-medium">
          <div className={['grid gap-2 md:gap-3 px-2 md:px-3', 'py-1 md:py-2'].join(' ')} style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}>
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={a.disabled}
                onClick={() => a.onClick(a.data)}
                className={[
                  'w-full rounded-xl text-sm md:text-base font-medium transition-all duration-200',
                  'px-2 md:px-3 py-1 md:py-2',
                  a.variant === 'secondary'
                    ? 'bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md',
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


