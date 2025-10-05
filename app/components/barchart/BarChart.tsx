'use client'

// Functionality: Mobile-first responsive SVG BarChart component

import React, { useMemo, useRef, useEffect, useState, useId } from 'react'
import type { BarChartProps, BarDatum } from './types'

function defaultValueFormatter(value: number, unit?: string) {
  if (unit === '$') {
    if (value >= 1000000) {
      const formatted = (value / 1000000).toFixed(1)
      return `$${formatted}M`
    } else if (value >= 1000) {
      const formatted = (value / 1000).toFixed(0)
      return `$${formatted}K`
    } else {
      return `$${value.toFixed(0)}`
    }
  } else if (unit === 'users') {
    if (value >= 1000) {
      const formatted = (value / 1000).toFixed(0)
      return `${formatted}K`
    } else {
      return `${value.toFixed(0)}`
    }
  } else if (unit === 'units') {
    if (value >= 1000) {
      const formatted = (value / 1000).toFixed(0)
      return `${formatted}K`
    } else {
      return `${value.toFixed(0)}`
    }
  } else if (unit === '%') {
    return `${value.toFixed(0)}%`
  } else {
    const formatted = Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)
    return unit ? `${formatted} ${unit}` : formatted
  }
}

function useContainerSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect
        setSize({ width: cr.width, height: cr.height })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, size }
}

function sortData(data: BarDatum[], sort: BarChartProps['sort']): BarDatum[] {
  if (!sort || sort === 'none') return data
  const copy = [...data]
  if (typeof sort === 'function') return copy.sort(sort)
  if (sort === 'value-desc') return copy.sort((a, b) => b.value - a.value)
  if (sort === 'value-asc') return copy.sort((a, b) => a.value - b.value)
  if (sort === 'alpha') return copy.sort((a, b) => a.category.localeCompare(b.category))
  return copy
}

export default function BarChart({
  data,
  orientation = 'vertical',
  logScale = false,
  sort = 'value-desc',
  title,
  xTitle,
  yTitle,
  unit,
  valueFormatter = defaultValueFormatter,
  className = '',
  barColor = '#2563eb',
  barRadius = 6,
  showGrid = true,
  paddingInner = 0.2,
  minValue,
  maxValue,
  height = 280,
}: BarChartProps) {
  const { ref, size } = useContainerSize<HTMLDivElement>()
  const instanceId = useId().replace(/:/g, '')
  const clipPathId = `plot-area-${instanceId}`

  const sortedData = useMemo(() => sortData(data, sort), [data, sort])

  const categories = useMemo(() => sortedData.map((d) => d.category), [sortedData])
  const values = useMemo(() => sortedData.map((d) => d.value), [sortedData])

  const computedMin = useMemo(() => {
    const vmin = minValue !== undefined ? minValue : Math.min(0, ...values)
    return logScale ? Math.max(0.0001, vmin) : vmin
  }, [values, minValue, logScale])

  const computedMax = useMemo(() => {
    const vmax = maxValue !== undefined ? maxValue : Math.max(0, ...values)
    return logScale ? Math.max(1, vmax) : vmax
  }, [values, maxValue, logScale])

  const margin = useMemo(() => ({ top: 16, right: 16, bottom: 56, left: 56 }), [])
  const innerWidth = Math.max(0, size.width - margin.left - margin.right)
  const innerHeight = Math.max(0, height - margin.top - margin.bottom)

  const bandDomain = categories
  const bandCount = bandDomain.length
  const bandStep = bandCount > 0 ? innerWidth / bandCount : 0
  const barWidth = Math.max(1, bandStep * (1 - paddingInner))
  const bandOffset = (bandStep - barWidth) / 2

  const axisTicks = 4
  const scaleValue = (v: number) => {
    if (logScale) {
      const min = Math.max(0.0001, computedMin)
      const max = Math.max(min * 10, computedMax)
      const lv = Math.log10(Math.max(min, v))
      const lmin = Math.log10(min)
      const lmax = Math.log10(max)
      const t = (lv - lmin) / (lmax - lmin || 1)
      return innerHeight * (1 - t)
    } else {
      const min = Math.min(0, computedMin)
      const max = Math.max(0, computedMax)
      const t = (v - min) / (max - min || 1)
      return innerHeight * (1 - t)
    }
  }

  const baselineY = scaleValue(0)

  const gridLines = useMemo(() => {
    const lines: { y: number; value: number }[] = []
    if (axisTicks <= 0) return lines
    
    if (logScale) {
      const min = Math.max(0.0001, computedMin)
      const max = Math.max(min * 10, computedMax)
      const lmin = Math.log10(min)
      const lmax = Math.log10(max)
      
      for (let i = 0; i <= axisTicks; i++) {
        const lv = lmin + (i / axisTicks) * (lmax - lmin)
        const v = Math.pow(10, lv)
        lines.push({ y: scaleValue(v), value: v })
      }
    } else {
      const min = Math.min(0, computedMin)
      const max = Math.max(0, computedMax)
      const range = max - min
      
      for (let i = 0; i <= axisTicks; i++) {
        const v = min + (i / axisTicks) * range
        lines.push({ y: scaleValue(v), value: v })
      }
    }
    return lines
  }, [axisTicks, computedMin, computedMax, logScale, innerHeight, scaleValue])

  const wrapLabel = (label: string, maxChars = 12) => {
    if (label.length <= maxChars) return [label]
    const words = label.split(' ')
    const lines: string[] = []
    let current = ''
    for (const w of words) {
      if ((current + ' ' + w).trim().length <= maxChars) {
        current = (current + ' ' + w).trim()
      } else {
        if (current) lines.push(current)
        current = w
      }
    }
    if (current) lines.push(current)
    return lines
  }

  return (
    <div ref={ref} className={[`w-full`, className].join(' ')}>
      <svg width={size.width} height={height} role="img" aria-label="Bar chart">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
            <rect x={0} y={0} width={innerWidth} height={innerHeight} rx={8} ry={8} />
          </clipPath>
        </defs>

        {title && (
          <text x={size.width / 2} y={20} textAnchor="middle" className="fill-gray-900 text-lg font-semibold">
            {title}
          </text>
        )}

        <g transform={`translate(${margin.left},${margin.top})`}>
          {showGrid && gridLines.map((g, idx) => (
            <g key={idx}>
              <line x1={0} x2={innerWidth} y1={g.y} y2={g.y} stroke="#e5e7eb" strokeDasharray="4 4" shapeRendering="crispEdges" />
              <text x={-8} y={g.y} textAnchor="end" dominantBaseline="middle" className="fill-gray-500 text-xs">
                {valueFormatter(g.value, unit)}
              </text>
            </g>
          ))}

          {!logScale && (
            <line x1={0} x2={innerWidth} y1={baselineY} y2={baselineY} stroke="#9ca3af" shapeRendering="crispEdges" />
          )}

          {orientation === 'vertical' && (
            <g clipPath={`url(#${clipPathId})`}>
              {sortedData.map((d, i) => {
                const x = i * bandStep + bandOffset
                const y = scaleValue(Math.max(0, d.value))
                const y0 = scaleValue(Math.min(0, d.value))
                const h = Math.max(0, y0 - y)
                const r = Math.min(barRadius, barWidth / 2, h / 2)
                const labelY = Math.min(innerHeight - 4, d.value >= 0 ? Math.max(12, y - 6) : y0 + 12)
                return (
                  <g key={d.id || d.category}>
                    <rect x={x} y={y} width={barWidth} height={h} fill={barColor} rx={r} ry={r} />
                    <text
                      x={x + barWidth / 2}
                      y={labelY}
                      textAnchor="middle"
                      className="fill-gray-700 text-xs font-medium"
                    >
                      {valueFormatter(d.value, unit)}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {orientation === 'vertical' && (
            <g transform={`translate(0, ${innerHeight})`}>
              {sortedData.map((d, i) => {
                const x = i * bandStep + bandOffset + barWidth / 2
                const lines = wrapLabel(d.category)
                const needsTilt = lines.length === 1 && lines[0].length > 12
                return (
                  <g key={d.id || d.category} transform={`translate(${x}, 14)`}>
                    {needsTilt ? (
                      <g transform="rotate(30)">
                        <text textAnchor="start" className="fill-gray-600 text-xs">{d.category}</text>
                      </g>
                    ) : (
                      lines.map((ln, li) => (
                        <text key={li} y={li * 12} textAnchor="middle" className="fill-gray-600 text-xs">{ln}</text>
                      ))
                    )}
                  </g>
                )
              })}
            </g>
          )}

          {xTitle && (
            <text x={innerWidth / 2} y={innerHeight + 40} textAnchor="middle" className="fill-gray-700 text-sm font-medium">
              {xTitle}
            </text>
          )}
          {yTitle && (
            <g transform={`translate(${-42}, ${innerHeight / 2}) rotate(-90)`}>
              <text textAnchor="middle" className="fill-gray-700 text-sm font-medium">{yTitle}{unit ? ` (${unit})` : ''}</text>
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}


