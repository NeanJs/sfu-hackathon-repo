'use client'

import React from 'react'
import type { SkeletonProps, SkeletonTextProps, SkeletonCardProps } from './types'

const sizeClasses = {
  xs: 'h-2',
  sm: 'h-3',
  md: 'h-4',
  lg: 'h-6',
  xl: 'h-8'
}

const avatarSizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const buttonSizeClasses = {
  xs: 'h-6 px-2',
  sm: 'h-8 px-3',
  md: 'h-10 px-4',
  lg: 'h-12 px-6',
  xl: 'h-14 px-8'
}

export default function Skeleton({
  variant = 'text',
  size = 'md',
  width,
  height,
  className = '',
  lines = 1,
  rounded = true
}: SkeletonProps) {
  const baseClasses = 'skeleton-shimmer'
  const roundedClasses = rounded ? 'rounded' : ''
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return `${sizeClasses[size]} ${roundedClasses}`
      case 'avatar':
        return `${avatarSizeClasses[size]} ${roundedClasses}`
      case 'button':
        return `${buttonSizeClasses[size]} ${roundedClasses}`
      case 'circle':
        return `${avatarSizeClasses[size]} rounded-full`
      case 'rect':
        return `${roundedClasses}`
      case 'card':
        return `h-32 ${roundedClasses}`
      default:
        return `${sizeClasses[size]} ${roundedClasses}`
    }
  }

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={index === lines - 1 ? { ...style, width: '75%' } : style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  )
}

export function SkeletonText({ 
  lines = 1, 
  size = 'md', 
  className = '',
  ...props 
}: SkeletonTextProps) {
  return (
    <Skeleton
      variant="text"
      lines={lines}
      size={size}
      className={className}
      {...props}
    />
  )
}

export function SkeletonCard({ 
  showAvatar = true, 
  showActions = true,
  className = '',
  ...props 
}: SkeletonCardProps) {
  return (
    <div className={`card p-4 space-y-4 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <Skeleton variant="avatar" size="md" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" size="md" width="60%" />
            <Skeleton variant="text" size="sm" width="40%" />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Skeleton variant="text" lines={2} size="md" />
        <Skeleton variant="text" size="sm" width="80%" />
      </div>
      
      {showActions && (
        <div className="flex space-x-2 pt-2">
          <Skeleton variant="button" size="sm" width="80px" />
          <Skeleton variant="button" size="sm" width="60px" />
        </div>
      )}
    </div>
  )
}

export function SkeletonAvatar({ 
  size = 'md', 
  className = '',
  ...props 
}: Omit<SkeletonProps, 'variant'>) {
  return (
    <Skeleton
      variant="avatar"
      size={size}
      className={className}
      {...props}
    />
  )
}

export function SkeletonButton({ 
  size = 'md', 
  className = '',
  ...props 
}: Omit<SkeletonProps, 'variant'>) {
  return (
    <Skeleton
      variant="button"
      size={size}
      className={className}
      {...props}
    />
  )
}
