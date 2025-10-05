'use client'

// Functionality: Types for BarChart component

export type BarChartOrientation = 'vertical' | 'horizontal'

export interface BarDatum {
  id?: string
  category: string
  value: number
}

export type BarChartSort = 'value-desc' | 'value-asc' | 'alpha' | 'none' | ((a: BarDatum, b: BarDatum) => number)

export interface BarChartProps {
  data: BarDatum[]
  orientation?: BarChartOrientation
  logScale?: boolean
  sort?: BarChartSort
  title?: string
  xTitle?: string
  yTitle?: string
  unit?: string
  valueFormatter?: (value: number, unit?: string) => string
  className?: string
  barColor?: string
  barRadius?: number
  showGrid?: boolean
  paddingInner?: number
  minValue?: number
  maxValue?: number
  height?: number
}


