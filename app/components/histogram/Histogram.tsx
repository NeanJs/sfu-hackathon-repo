'use client'

// Functionality: Mobile-first responsive SVG Histogram with shared bins and count/density scaling

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { HistogramProps, HistogramSeries, ComputedBin } from './types'

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

function computeDomain(series: HistogramSeries[], provided?: [number, number]): [number, number] {
  if (provided) return provided
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const s of series) {
    for (const v of s.values) {
      if (Number.isFinite(v)) {
        if (v < min) min = v
        if (v > max) max = v
      }
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1]
  if (min === max) return [min - 0.5, max + 0.5]
  return [min, max]
}

function computeBins(domain: [number, number], binEdges?: number[], binWidth?: number): ComputedBin[] {
  const [d0, d1] = domain
  if (binEdges && binEdges.length >= 2) {
    const edges = [...binEdges].sort((a, b) => a - b)
    const bins: ComputedBin[] = []
    for (let i = 0; i < edges.length - 1; i++) {
      const x0 = edges[i]
      const x1 = edges[i + 1]
      bins.push({ x0, x1, width: x1 - x0 })
    }
    return bins
  }
  
  // Calculate appropriate bin width to avoid too many bins
  const range = d1 - d0
  const maxBins = 6 // Further limit to prevent label overlap
  const minBinWidth = range / maxBins
  
  let width = binWidth && binWidth > 0 ? binWidth : minBinWidth
  if (width < minBinWidth) width = minBinWidth
  
  // Round to nice numbers for better readability
  const magnitude = Math.pow(10, Math.floor(Math.log10(width)))
  width = Math.ceil(width / magnitude) * magnitude
  
  const start = Math.floor(d0 / width) * width
  const end = Math.ceil(d1 / width) * width
  const bins: ComputedBin[] = []
  for (let x = start; x < end - 1e-12; x += width) {
    bins.push({ x0: x, x1: x + width, width })
  }
  return bins
}

function countValuesInBins(values: number[], bins: ComputedBin[]): number[] {
  const counts = new Array(bins.length).fill(0)
  for (const v of values) {
    if (!Number.isFinite(v)) continue
    for (let i = 0; i < bins.length; i++) {
      const b = bins[i]
      const isLast = i === bins.length - 1
      const inBin = isLast ? v >= b.x0 && v <= b.x1 : v >= b.x0 && v < b.x1
      if (inBin) {
        counts[i] += 1
        break
      }
    }
  }
  return counts
}

function pickColor(index: number): string {
  const palette = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  return palette[index % palette.length]
}

export default function Histogram({
  series,
  bins,
  height = 500,
  title,
  xTitle,
  yTitle,
  unit,
  yScale = 'count',
  showGrid = true,
  className = '',
  barRadius = 4,
  paddingInner = 0.1,
}: HistogramProps) {
  const { ref, size } = useContainerSize<HTMLDivElement>()
  const instanceId = useId().replace(/:/g, '')
  const clipPathId = `hist-plot-${instanceId}`

  const domain = useMemo(() => computeDomain(series, bins.domain), [series, bins])
  const computedBins = useMemo(() => computeBins(domain, bins.binEdges, bins.binWidth), [domain, bins])

  const countsPerSeries = useMemo(() => {
    return series.map((s) => countValuesInBins(s.values, computedBins))
  }, [series, computedBins])

  const densitiesPerSeries = useMemo(() => {
    if (yScale !== 'density') return []
    return countsPerSeries.map((counts, si) => {
      const n = Math.max(1, series[si].values.length)
      return counts.map((c, bi) => c / (n * (computedBins[bi].width || 1)))
    })
  }, [countsPerSeries, series, computedBins, yScale])

  const stackedMax = useMemo(() => {
    const binCount = computedBins.length
    let maxVal = 0
    for (let i = 0; i < binCount; i++) {
      let acc = 0
      for (let s = 0; s < series.length; s++) {
        const v = yScale === 'density' ? densitiesPerSeries[s]?.[i] ?? 0 : countsPerSeries[s]?.[i] ?? 0
        acc += v
      }
      if (acc > maxVal) maxVal = acc
    }
    return maxVal
  }, [computedBins.length, countsPerSeries, densitiesPerSeries, series.length, yScale])

  const margin = useMemo(() => ({ top: 16, right: 16, bottom: 200, left: 56 }), [])
  const innerWidth = Math.max(0, size.width - margin.left - margin.right)
  const innerHeight = Math.max(0, height - margin.top - margin.bottom)

  const bandCount = computedBins.length
  const bandStep = bandCount > 0 ? innerWidth / bandCount : 0
  const barWidth = Math.max(1, bandStep * (1 - paddingInner))
  const bandOffset = (bandStep - barWidth) / 2

  const scaleY = (v: number) => {
    const max = stackedMax <= 0 ? 1 : stackedMax
    const t = v / max
    return innerHeight * (1 - t)
  }

  const axisTicks = 4
  const gridLines = useMemo(() => {
    const lines: { y: number; value: number }[] = []
    for (let i = 0; i <= axisTicks; i++) {
      const v = (stackedMax * i) / axisTicks
      lines.push({ y: scaleY(v), value: v })
    }
    return lines
  }, [axisTicks, stackedMax, scaleY])

  return (
    <div ref={ref} className={[`w-full`, className].join(' ')}>
      <svg width={size.width} height={height} role="img" aria-label="Histogram">
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
                {yScale === 'count' ? `${Math.round(g.value)}` : g.value.toFixed(3)}
              </text>
            </g>
          ))}

          <g clipPath={`url(#${clipPathId})`}>
            {computedBins.map((b, i) => {
              const x = i * bandStep + bandOffset
              let yAcc = innerHeight
              return (
                <g key={`bin-${i}`}>
                  {series.map((s, si) => {
                    const color = s.color || pickColor(si)
                    const v = yScale === 'density' ? densitiesPerSeries[si]?.[i] ?? 0 : countsPerSeries[si]?.[i] ?? 0
                    const yTop = scaleY(v)
                    const segmentHeight = innerHeight - yTop
                    const y = yAcc - segmentHeight
                    yAcc = y
                    const r = Math.min(barRadius, barWidth / 2, segmentHeight / 2)
                    return (
                      <rect key={`${s.id}-${i}`} x={x} y={y} width={barWidth} height={segmentHeight} fill={color} rx={r} ry={r} />
                    )
                  })}
                </g>
              )
            })}
          </g>

          <g transform={`translate(0, ${innerHeight})`}>
            {computedBins.map((b, i) => {
              const x = i * bandStep + bandOffset + barWidth / 2
              const needsTilt = bandStep < 100 || computedBins.length > 4
              const label = `${b.x0.toFixed(1)}–${b.x1.toFixed(1)}${unit ? ` ${unit}` : ''}`
              return (
                <g key={`xlabel-${i}`} transform={`translate(${x}, ${needsTilt ? 50 : 14})`}>
                  {needsTilt ? (
                    <g transform="rotate(45)">
                      <text textAnchor="start" className="fill-gray-600 text-xs">{label}</text>
                    </g>
                  ) : (
                    <text textAnchor="middle" className="fill-gray-600 text-xs">{label}</text>
                  )}
                </g>
              )
            })}
          </g>

          {xTitle && (
            <text x={innerWidth / 2} y={innerHeight + 180} textAnchor="middle" className="fill-gray-700 text-sm font-medium">
              {xTitle}
            </text>
          )}
          {yTitle && (
            <g transform={`translate(${-42}, ${innerHeight / 2}) rotate(-90)`}>
              <text textAnchor="middle" className="fill-gray-700 text-sm font-medium">{yTitle}{yScale === 'count' ? '' : ' (density)'}</text>
            </g>
          )}

          <g transform={`translate(${Math.max(0, innerWidth - 120)}, 0)`}>
            <rect x={0} y={0} width={120} height={series.length * 18 + 12} rx={8} ry={8} fill="#ffffff" stroke="#e5e7eb" />
            {series.map((s, si) => (
              <g key={`legend-${s.id}`} transform={`translate(8, ${10 + si * 18})`}>
                <rect x={0} y={-8} width={12} height={12} fill={s.color || pickColor(si)} rx={2} ry={2} />
                <text x={18} y={0} dominantBaseline="middle" className="fill-gray-700 text-xs">{s.id}</text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}


