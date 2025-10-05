import type { ReactNode } from 'react'

export interface CardOverlayProps {
  isOpen: boolean
  onClose?: () => void
  title?: string | ReactNode
  headerRight?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  className?: string
  contentClassName?: string
  closeLabel?: string
  ariaLabel?: string
}


