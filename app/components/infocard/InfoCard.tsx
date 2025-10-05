'use client'

// Functionality: InfoCard - mobile-first, responsive info display card

import React, { useEffect, useMemo, useState } from 'react'
import type { InfoCardData } from './types'
import { fetchInfoCard } from './api'

interface InfoCardProps {
  id?: string
  data?: InfoCardData
  className?: string
  children?: React.ReactNode
}

export default function InfoCard({ id, data, className = '', children }: InfoCardProps) {
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState<InfoCardData | null>(null)

  const effectiveData = useMemo(() => data ?? fetched, [data, fetched])

  useEffect(() => {
    let mounted = true
    if (!data && id) {
      setLoading(true)
      fetchInfoCard(id).then((res) => {
        if (!mounted) return
        setFetched(res)
        setLoading(false)
      })
    }
    return () => {
      mounted = false
    }
  }, [id, data])

  if (!effectiveData && loading) {
    return (
      <section className={[`w-full h-full`, className].join(' ')}>
        <div className="card-elevated w-full h-full p-3 sm:p-4 animate-in">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            <div className="h-40 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
      </section>
    )
  }

  if (!effectiveData) {
    return null
  }

  const { title, body, media } = effectiveData

  return (
    <section className={[`w-full h-full`, className].join(' ')}>
      <article className="card-elevated w-full h-full overflow-hidden">
        {media && media.length > 0 && (
          <div className="w-full">
            {media.slice(0, 1).map((m, idx) => (
              <div key={idx} className="w-full overflow-hidden" style={{ aspectRatio: m.aspectRatio || '16/9' }}>
                <img
                  src={m.src}
                  alt={m.alt || ''}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div className="p-3 sm:p-4">
          <div className="mb-3 sm:mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold leading-tight">{title}</h3>
          </div>
          {body && (
            <p className="text-sm sm:text-base text-muted-foreground">{body}</p>
          )}

          {children && (
            <div className="mt-4 sm:mt-6">
              {children}
            </div>
          )}
        </div>
      </article>
    </section>
  )
}


