'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Home as HomeIcon, BarChart3, FileText, Settings } from 'lucide-react'
import CompanyDirectory from './components/company-directory/CompanyDirectory'
import { CardOverlay } from './components/card-overlay'
import { CompanyDetail } from './components/company-detail'
import type { Company } from './components/company-directory/data'

function HomeContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [activeCompanyName, setActiveCompanyName] = useState<string>('')
  const [retryKey, setRetryKey] = useState(0)

  const toSlug = (name: string): string => {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const fromSlug = (slug: string): string => {
    return slug.replace(/-/g, ' ').trim()
  }

  const openOverlayForName = useCallback((name: string) => {
    console.log('openOverlayForName called with:', name)
    console.log('Setting overlay state...')
    setActiveCompanyName(name)
    setOverlayOpen(true)
    console.log('Overlay state should now be:', { overlayOpen: true, activeCompanyName: name })
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('company', toSlug(name))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
    setActiveCompanyName('')
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.delete('company')
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(nextUrl, { scroll: false })
  }, [pathname, router, searchParams])

  useEffect(() => {
    const slug = searchParams?.get('company') || ''
    console.log('URL searchParams changed, slug:', slug)
    if (slug) {
      const name = fromSlug(slug)
      console.log('Setting overlay from URL:', name)
      setActiveCompanyName(name)
      setOverlayOpen(true)
    } else {
      console.log('No company in URL, closing overlay')
      setOverlayOpen(false)
      setActiveCompanyName('')
    }
  }, [searchParams])

  useEffect(() => {
    console.log('Overlay state changed:', { overlayOpen, activeCompanyName })
  }, [overlayOpen, activeCompanyName])

  const handleSelectionChange = (selectedCompanies: Company[]) => {
    console.log('Selected companies:', selectedCompanies)
  }


  const handleCompanyOpen = (company: Company) => {
    console.log('handleCompanyOpen called with:', company)
    console.log('Current overlay state:', { overlayOpen, activeCompanyName })
    openOverlayForName(company.name)
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="app-container">
        <div className="app-section animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
            </div>
          </div>

          <div className="app-grid">
            <div className="card p-4 text-center hover:shadow-medium transition-all duration-200">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <HomeIcon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Companies</h3>
              <p className="text-xs text-muted-foreground">Browse directory</p>
            </div>
            <div className="card p-4 text-center hover:shadow-medium transition-all duration-200">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Analytics</h3>
              <p className="text-xs text-muted-foreground">View insights</p>
            </div>
            <div className="card p-4 text-center hover:shadow-medium transition-all duration-200">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-secondary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Reports</h3>
              <p className="text-xs text-muted-foreground">Generate docs</p>
            </div>
            <div className="card p-4 text-center hover:shadow-medium transition-all duration-200">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted/20 flex items-center justify-center">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Settings</h3>
              <p className="text-xs text-muted-foreground">Configure</p>
            </div>
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Company Directory</h2>
              <div className="text-sm text-muted-foreground">Browse and explore</div>
            </div>
            <div className="card-elevated p-4">
              <CompanyDirectory selectable={false} onCompanyOpen={handleCompanyOpen} />
            </div>
          </div>
        </div>
      </div>

      <CardOverlay
        isOpen={overlayOpen}
        onClose={closeOverlay}
        title={activeCompanyName || 'Company'}
        headerRight={activeCompanyName ? (
          <button
            type="button"
            onClick={() => setRetryKey(k => k + 1)}
            className="btn-secondary px-3 py-1.5 text-sm"
          >
            Retry
          </button>
        ) : null}
      >
        {overlayOpen && activeCompanyName && (
          <CompanyDetail key={`${activeCompanyName}:${retryKey}`} companyName={activeCompanyName} />
        )}
      </CardOverlay>
      
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="app-container">
          <div className="app-section animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
              </div>
            </div>

            <div className="app-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="card p-4 text-center">
                  <div className="animate-pulse">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted"></div>
                    <div className="h-4 bg-muted rounded mb-1"></div>
                    <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="card-elevated p-4">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  )
}