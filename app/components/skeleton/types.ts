export type SkeletonVariant = 'text' | 'card' | 'avatar' | 'button' | 'circle' | 'rect'

export type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface SkeletonProps {
  variant?: SkeletonVariant
  size?: SkeletonSize
  width?: string | number
  height?: string | number
  className?: string
  lines?: number
  rounded?: boolean
}

export interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
  lines?: number
}

export interface SkeletonCardProps extends Omit<SkeletonProps, 'variant'> {
  showAvatar?: boolean
  showActions?: boolean
}
