'use client'

// Functionality: InfoCard data fetching (Firebase-ready shim)

import type { InfoCardData, InfoCardFetcher } from './types'

let customFetcher: InfoCardFetcher | null = null

export function setInfoCardFetcher(fetcher: InfoCardFetcher) {
  customFetcher = fetcher
}

export async function fetchInfoCard(id: string): Promise<InfoCardData | null> {
  if (customFetcher) {
    return customFetcher(id)
  }

  await new Promise((r) => setTimeout(r, 250))

  const demo: InfoCardData = {
    id,
    title: 'Demo InfoCard',
    body: 'This is a demo InfoCard loaded from the default shim. Replace by calling setInfoCardFetcher with your Firebase implementation.',
    media: [
      {
        kind: 'image',
        src: 'https://images.unsplash.com/photo-1520975693416-35a6c1e464a0?q=80&w=1200&auto=format&fit=crop',
        alt: 'Unsplash cover',
        aspectRatio: '16/9'
      }
    ]
  }

  return demo
}


