'use client'

// Functionality: Mobile-first, responsive CompanyDetail component with beautiful full-width sections

import React, { useEffect, useMemo, useState } from 'react'
import type { CompanyDetailProps, CompanyFullAnalysis, Violation } from './types'
import { fetchCompanyFullAnalysis } from './api'
import { LoadingSpinner } from '../loading-spinner'

function KeyValue({ label, value, icon }: { label: string; value?: React.ReactNode; icon?: string }) {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-background via-background to-primary/5 rounded-2xl border border-border/40">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary text-lg font-bold shadow-sm">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
        <div className="text-sm leading-relaxed break-words text-foreground font-medium">{value}</div>
      </div>
    </div>
  )
}

function Section({ title, children, icon }: { title: string; children?: React.ReactNode; icon?: string }) {
  if (!children) return null
  return (
    <section className="w-full mb-12 animate-in">
      <div className="flex items-center gap-4 mb-8 relative">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-primary/25">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{title}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full opacity-60"></div>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function ViolationsList({ violations }: { violations?: Violation[] }) {
  if (!violations || violations.length === 0) return null
  return (
    <div className="grid gap-6">
      {violations.map((v, idx) => (
        <div key={idx} className="card-elevated p-8 border-l-4 border-l-red-500/30">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-red-500 text-2xl font-bold shadow-lg">
              ⚠️
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">{(v.violation_type || 'Violation').replace(/\b\w/g, l => l.toUpperCase())}</h3>
              <div className="text-sm font-semibold text-muted-foreground bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full inline-block">Violation #{idx + 1}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <KeyValue label="SDG Impacted" value={v.sdg_impacted} icon="🎯" />
            <KeyValue label="Date" value={v.date} icon="📅" />
            <KeyValue label="Sources" value={v.source} icon="📚" />
            <div className="sm:col-span-2">
              <KeyValue label="Summary" value={v.actionable_summary} icon="📝" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ExtraInfo({ data }: { data: CompanyFullAnalysis }) {
  const knownTopKeys = new Set([
    'company_name',
    'score_data',
    'activism_plan',
    'ethical_reinvestment_idea',
    'pipeline_control_status'
  ])
  const extraEntries = Object.entries(data).filter(([k]) => !knownTopKeys.has(k))
  if (extraEntries.length === 0) return null

  return (
    <div className="grid gap-6">
      {extraEntries.map(([k, v]) => (
        <div key={k} className="card-elevated p-8 border-l-4 border-l-accent/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center text-accent text-lg font-bold shadow-lg">
              📊
            </div>
            <h3 className="text-xl font-bold text-foreground">{k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
          </div>
          <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl p-6 border border-border/30">
            <pre className="text-sm whitespace-pre-wrap break-words text-foreground font-mono leading-relaxed">{JSON.stringify(v, null, 2)}</pre>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CompanyDetail({ companyName, data, className = '' }: CompanyDetailProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetched, setFetched] = useState<CompanyFullAnalysis | null>(null)

  const effectiveData = useMemo(() => data ?? fetched, [data, fetched])

  useEffect(() => {
    let mounted = true
    if (!data && companyName) {
      setLoading(true)
      setError(null)
      fetchCompanyFullAnalysis(companyName)
        .then((res) => {
          if (!mounted) return
          setFetched(res)
        })
        .catch(() => {
          if (!mounted) return
          setError('Failed to load company analysis')
        })
        .finally(() => {
          if (!mounted) return
          setLoading(false)
        })
    }
    return () => {
      mounted = false
    }
  }, [companyName, data])

  if (loading && !effectiveData) {
    return (
      <div className={[`w-full`, className].join(' ')}>
        <div className="card-elevated p-6 flex items-center justify-center min-h-48">
          <LoadingSpinner size="lg" label="Loading company details" />
        </div>
      </div>
    )
  }

  if (error && !effectiveData) {
    return (
      <div className={[`w-full`, className].join(' ')}>
        <div className="card-elevated p-6 text-center text-sm text-muted-foreground">{error}</div>
      </div>
    )
  }

  if (!effectiveData) return null

  const name = effectiveData.company_name?.trim() || companyName
  const score = effectiveData.score_data
  const activism = effectiveData.activism_plan
  const reinvest = effectiveData.ethical_reinvestment_idea
  const pipeline = effectiveData.pipeline_control_status

  return (
    <div className={[`w-full space-y-12`, className].join(' ')}>
      {/* Company Identity Section */}
      <Section title="Company Identity" icon="🏢">
        <div className="card-elevated p-10 border-l-4 border-l-primary/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="flex-shrink-0 relative">
              {score?.logo_url ? (
                <div className="relative">
                  <img
                    src={score.logo_url}
                    alt={`${name} logo`}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl border-2 border-border object-contain bg-white shadow-xl"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl border-2 border-border bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl font-bold text-primary shadow-xl">
                  {name?.[0] || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">{name}</h1>
              <div className="text-xl text-muted-foreground mb-6 font-medium">{score?.category || 'Uncategorized'}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <KeyValue label="Transparency Score" value={score?.transparency_score ?? 'N/A'} icon="📊" />
                <KeyValue label="Primary SDG Violation" value={score?.primary_sdg_violation} icon="⚠️" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Risk Summary Section */}
      {score?.risk_summary && (
        <Section title="Risk Assessment" icon="🔍">
          <div className="card-elevated p-8 border-l-4 border-l-orange-500/30">
            <KeyValue label="Risk Summary" value={score.risk_summary} icon="📋" />
          </div>
        </Section>
      )}

      {/* Violations Section */}
      {score?.detailed_violations && score.detailed_violations.length > 0 && (
        <Section title="Detailed Violations" icon="⚠️">
          <ViolationsList violations={score.detailed_violations} />
        </Section>
      )}

      {/* Activism Plan Section */}
      {activism && (
        <Section title={(activism.action_plan_title || 'Activism Plan').replace(/\b\w/g, l => l.toUpperCase())} icon="✊">
          <div className="card-elevated p-8 border-l-4 border-l-green-500/30">
            <div className="space-y-8">
              {activism.template_script && (
                <KeyValue label="Template Script" value={activism.template_script} icon="📝" />
              )}
              {Array.isArray(activism.recommended_actions) && activism.recommended_actions.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-500 text-lg font-bold shadow-lg">✓</span>
                    Recommended Actions
                  </h3>
                  <div className="grid gap-6">
                    {activism.recommended_actions.map((a, i) => (
                      <div key={i} className="p-6 bg-gradient-to-br from-green-50/80 to-blue-50/80 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-500 text-lg font-bold flex-shrink-0 shadow-md">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-foreground mb-2 text-lg">{((a.label || a.category) ? (a.label || a.category)!.replace(/\b\w/g, l => l.toUpperCase()) : `Action ${i + 1}`)}</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">{a.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Impact & Status Section */}
      {(reinvest || pipeline) && (
        <Section title="Impact & Status" icon="🌱">
          <div className="card-elevated p-8 border-l-4 border-l-emerald-500/30">
            <div className="grid gap-6">
              <KeyValue label="Ethical Reinvestment Idea" value={reinvest} icon="💰" />
              <KeyValue label="Pipeline Control Status" value={pipeline} icon="🔧" />
            </div>
          </div>
        </Section>
      )}

      {/* Additional Data Section */}
      {(() => {
        const knownTopKeys = new Set([
          'company_name',
          'score_data',
          'activism_plan',
          'ethical_reinvestment_idea',
          'pipeline_control_status'
        ])
        const extraEntries = Object.entries(effectiveData).filter(([k]) => !knownTopKeys.has(k))
        return extraEntries.length > 0 ? (
          <Section title="Additional Data" icon="📊">
            <ExtraInfo data={effectiveData} />
          </Section>
        ) : null
      })()}
    </div>
  )
}


