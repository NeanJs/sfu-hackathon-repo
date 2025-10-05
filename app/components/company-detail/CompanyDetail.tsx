'use client'

// Functionality: Mobile-first, responsive CompanyDetail component with beautiful full-width sections

import React, { useEffect, useMemo, useState } from 'react'
import type { CompanyDetailProps, CompanyFullAnalysis, Violation } from './types'
import { fetchCompanyFullAnalysis } from './api'
import { LoadingSpinner } from '../loading-spinner'

function KeyValue({ label, value, icon }: { label: string; value?: React.ReactNode; icon?: string }) {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-background to-muted/30 rounded-xl border border-border/50 hover:border-border transition-all duration-200">
      {icon && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
        <div className="text-sm leading-relaxed break-words text-foreground">{value}</div>
      </div>
    </div>
  )
}

function Section({ title, children, icon }: { title: string; children?: React.ReactNode; icon?: string }) {
  if (!children) return null
  return (
    <section className="w-full mb-8 animate-in">
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold shadow-lg">
            {icon}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function ViolationsList({ violations }: { violations?: Violation[] }) {
  if (!violations || violations.length === 0) return null
  return (
    <div className="grid gap-4">
      {violations.map((v, idx) => (
        <div key={idx} className="card-elevated p-6 hover:shadow-hard transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 text-lg font-bold">
              ⚠️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{v.violation_type || 'Violation'}</h3>
              <div className="text-sm text-muted-foreground">Violation #{idx + 1}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    <div className="grid gap-4">
      {extraEntries.map(([k, v]) => (
        <div key={k} className="card-elevated p-6 hover:shadow-hard transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-sm font-semibold">
              📊
            </div>
            <h3 className="text-lg font-semibold text-foreground capitalize">{k.replace(/_/g, ' ')}</h3>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <pre className="text-sm whitespace-pre-wrap break-words text-foreground font-mono">{JSON.stringify(v, null, 2)}</pre>
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
    <div className={[`w-full space-y-8`, className].join(' ')}>
      {/* Company Identity Section */}
      <Section title="Company Identity" icon="🏢">
        <div className="card-elevated p-8 hover:shadow-hard transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0">
              {score?.logo_url ? (
                <img
                  src={score.logo_url}
                  alt={`${name} logo`}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-border object-contain bg-white shadow-lg"
                  loading="lazy"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-border bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {name?.[0] || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{name}</h1>
              <div className="text-lg text-muted-foreground mb-4">{score?.category || 'Uncategorized'}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="card-elevated p-6 hover:shadow-hard transition-all duration-300">
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
        <Section title={activism.action_plan_title || 'Activism Plan'} icon="✊">
          <div className="card-elevated p-6 hover:shadow-hard transition-all duration-300">
            <div className="space-y-6">
              {activism.template_script && (
                <KeyValue label="Template Script" value={activism.template_script} icon="📝" />
              )}
              {Array.isArray(activism.recommended_actions) && activism.recommended_actions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-sm">✓</span>
                    Recommended Actions
                  </h3>
                  <div className="grid gap-4">
                    {activism.recommended_actions.map((a, i) => (
                      <div key={i} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-sm font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-foreground mb-1">{a.label || a.category || `Action ${i + 1}`}</div>
                            <div className="text-sm text-muted-foreground">{a.description}</div>
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
          <div className="card-elevated p-6 hover:shadow-hard transition-all duration-300">
            <div className="grid gap-4">
              <KeyValue label="Ethical Reinvestment Idea" value={reinvest} icon="💰" />
              <KeyValue label="Pipeline Control Status" value={pipeline} icon="🔧" />
            </div>
          </div>
        </Section>
      )}

      {/* Additional Data Section */}
      <Section title="Additional Data" icon="📊">
        <ExtraInfo data={effectiveData} />
      </Section>
    </div>
  )
}


