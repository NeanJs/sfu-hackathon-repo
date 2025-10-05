'use client'

// Functionality: Types for Histogram component

export type HistogramScale = 'count' | 'density'

export interface HistogramSeries {
  id: string
  values: number[]
  color?: string
}

export interface HistogramBinsConfig {
  binEdges?: number[]
  binWidth?: number
  domain?: [number, number]
}

export interface HistogramProps {
  series: HistogramSeries[]
  bins: HistogramBinsConfig
  height?: number
  title?: string
  xTitle?: string
  yTitle?: string
  unit?: string
  yScale?: HistogramScale
  showGrid?: boolean
  className?: string
  barRadius?: number
  paddingInner?: number
}

export interface ComputedBin {
  x0: number
  x1: number
  width: number
}


