// Functionality: Company Directory UI component

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Company, CompanyCategory } from './data'
import { queryCompanies, ALL_CATEGORIES } from './data'

type LoadState = 'idle' | 'loading' | 'done'

const PAGE_SIZE = 9

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase() || name.slice(0, 2).toUpperCase()
}

function LogoBanner({ company }: { company: Company }) {
  const [errored, setErrored] = useState(false)
  const initials = useMemo(() => getInitials(company.name), [company.name])
  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border bg-secondary/40">
      {errored ? (
        <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl font-semibold text-secondary-foreground">
          {initials}
        </div>
      ) : (
        <img
          src={company.logoUrl}
          alt={`${company.name} logo`}
          className="h-full w-full object-contain p-6"
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}
    </div>
  )
}

interface CompanyDirectoryProps {
  selectable?: boolean
  multiselect?: boolean
  onSelectionChange?: (selectedCompanies: Company[]) => void
}

export default function CompanyDirectory({ selectable = false, multiselect = true, onSelectionChange }: CompanyDirectoryProps) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [items, setItems] = useState<Company[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadState, setLoadState] = useState<LoadState>('idle')
  const [selectedCategory, setSelectedCategory] = useState<CompanyCategory | null>(null)
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set())

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasMoreRef = useRef(hasMore)
  const loadStateRef = useRef(loadState)

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    loadStateRef.current = loadState
  }, [loadState])

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 150)
    return () => window.clearTimeout(t)
  }, [search])

  useEffect(() => {
    setItems([])
    setPage(0)
    setHasMore(true)
  }, [debouncedSearch, selectedCategory])

  const loadPage = useCallback(async (pageToLoad: number) => {
    if (loadStateRef.current === 'loading') return
    setLoadState('loading')
    const result = await queryCompanies({ search: debouncedSearch, page: pageToLoad, pageSize: PAGE_SIZE, category: selectedCategory })
    setItems((prev) => {
      const existingIds = new Set(prev.map(item => item.id))
      const newItems = result.items.filter(item => !existingIds.has(item.id))
      return [...prev, ...newItems]
    })
    setHasMore(result.hasMore)
    const nextState: LoadState = result.hasMore ? 'idle' : 'done'
    setLoadState(nextState)
  }, [debouncedSearch, selectedCategory])

  useEffect(() => {
    loadPage(0)
  }, [loadPage])

  useEffect(() => {
    if (!sentinelRef.current) return
    const el = sentinelRef.current
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry.isIntersecting) return
      if (!hasMoreRef.current) return
      if (loadStateRef.current === 'loading') return
      setPage((p) => p + 1)
    }, { rootMargin: '400px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (page === 0 || !hasMore) return
    loadPage(page)
  }, [page, loadPage, hasMore])


  const toggleCompanySelection = (companyId: string) => {
    setSelectedCompanies(prev => {
      let newSet: Set<string>
      
      if (multiselect) {
        // Multiselect mode: toggle selection
        newSet = new Set(prev)
        if (newSet.has(companyId)) {
          newSet.delete(companyId)
        } else {
          newSet.add(companyId)
        }
      } else {
        // Single-select mode: replace selection
        if (prev.has(companyId)) {
          newSet = new Set() // Deselect if already selected
        } else {
          newSet = new Set([companyId]) // Select only this company
        }
      }
      
      // Notify parent component of selection changes
      if (onSelectionChange) {
        const selectedCompanies = items.filter(company => newSet.has(company.id))
        onSelectionChange(selectedCompanies)
      }
      
      return newSet
    })
  }

  return (
    <section aria-label="Company Directory" className="mx-auto w-full max-w-5xl">
      <div className="mb-4 sm:mb-6 flex items-end justify-between gap-3">
        <div className="w-full">
          <label htmlFor="company-search" className="block text-sm font-medium mb-2">Search companies</label>
          <div className="relative">
            <input
              id="company-search"
              aria-label="Search companies by name or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category"
              className="w-full rounded-xl border bg-background/90 px-4 py-3 shadow-soft focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/70"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="mb-2 text-sm font-medium">Categories</div>
        <div role="group" aria-label="Filter by category" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            aria-pressed={selectedCategory === null}
            className={[
              'inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs sm:text-sm transition-colors',
              selectedCategory === null
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground'
            ].join(' ')}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={[
                'inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs sm:text-sm transition-colors',
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground'
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div role="grid" aria-rowcount={items.length} className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {items.map((c) => {
          const isSelected = selectedCompanies.has(c.id)
          return (
            <article
              key={c.id}
              role="gridcell"
              onClick={() => selectable && toggleCompanySelection(c.id)}
              className={[
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-2xl border border-border bg-background shadow-soft overflow-hidden hover:border-primary hover:shadow-medium transition-all duration-200",
                selectable && "cursor-pointer",
                isSelected && "border-orange-400 bg-orange-50/50"
              ].join(' ')}
            >
              <LogoBanner company={c} />
              <div className="px-4 py-5 text-center">
                <h3 className="text-lg sm:text-xl font-bold">{c.name}</h3>
                <p className="text-base text-muted-foreground">{c.category}</p>
                {isSelected && (
                  <div className="mt-2 text-sm text-primary font-medium">Selected</div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <div ref={sentinelRef} className="h-10" aria-hidden="true" />

      <div className="mt-4 flex items-center justify-center">
        {loadState === 'loading' && (
          <div className="text-sm text-muted-foreground">Loading…</div>
        )}
        {loadState === 'done' && items.length === 0 && (
          <div className="text-sm text-muted-foreground">No results</div>
        )}
      </div>
    </section>
  )
}


