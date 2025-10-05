'use client'

// Functionality: Single source of truth for top header and bottom tab links

import React from 'react'
import { Home, Grid3X3 } from 'lucide-react'

export interface NavLinkItem {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
}

export const NAV_LINKS: NavLinkItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: <Home className="w-5 h-5" />
  },
  {
    id: 'demo',
    label: 'Demo',
    href: '/demo',
    icon: <Grid3X3 className="w-5 h-5" />
  }
]

export default NAV_LINKS


