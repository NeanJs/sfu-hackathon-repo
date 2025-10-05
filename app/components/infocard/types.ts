'use client'

// Functionality: InfoCard types

export interface InfoCardMedia {
  kind: 'image'
  src: string
  alt?: string
  aspectRatio?: string
}

export interface InfoCardData {
  id: string
  title: string
  body?: string
  media?: InfoCardMedia[]
  metadata?: Record<string, unknown>
}

export type InfoCardFetcher = (id: string) => Promise<InfoCardData | null>


