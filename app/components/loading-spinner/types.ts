export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type SpinnerVariant = 'primary' | 'secondary' | 'muted' | 'white'

export interface LoadingSpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  className?: string
  label?: string
}