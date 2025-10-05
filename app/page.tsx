'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CompanyDirectory from './components/company-directory/CompanyDirectory'
import Tabs, { type Tab } from './components/tabs/Tabs'
import { CardOverlay } from './components/card-overlay'
import { CompanyDetail } from './components/company-detail'
import type { Company } from './components/company-directory/data'

export default function Home() {
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
    setActiveCompanyName(name)
    setOverlayOpen(true)
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
    if (slug) {
      const name = fromSlug(slug)
      setActiveCompanyName(name)
      setOverlayOpen(true)
    } else {
      setOverlayOpen(false)
      setActiveCompanyName('')
    }
  }, [searchParams])

  const handleSelectionChange = (selectedCompanies: Company[]) => {
    console.log('Selected companies:', selectedCompanies)
  }

  const handleTabChange = (tabId: string) => {
    console.log('Active tab changed to:', tabId)
  }

  const handleCompanyOpen = (company: Company) => {
    openOverlayForName(company.name)
  }

  const tabs: Tab[] = [
    {
      id: 'companies',
      label: 'Companies',
      content: (
        <div className="card-elevated p-3 sm:p-4">
          <CompanyDirectory selectable={false} onCompanyOpen={handleCompanyOpen} />
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <div className="card-elevated p-3 sm:p-4">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Coming soon - detailed analytics and insights</p>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      label: 'Reports',
      content: (
        <div className="card-elevated p-3 sm:p-4">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Reports</h3>
            <p className="text-muted-foreground">Generate and download transparency reports</p>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div className="card-elevated p-3 sm:p-4">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Settings</h3>
            <p className="text-muted-foreground">Configure your preferences and notifications</p>
          </div>
        </div>
      )
    },
    {
      id: 'help',
      label: 'Help & Support',
      content: (
        <div className="card-elevated p-3 sm:p-4">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Help & Support</h3>
            <p className="text-muted-foreground">Get help and contact our support team</p>
          </div>
        </div>
      )
    },
    {
      id: 'about',
      label: 'About',
      content: (
        <div className="card-elevated p-3 sm:p-4">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">About Transparency Ledger</h3>
            <p className="text-muted-foreground">Learn more about our mission and values</p>
          </div>
        </div>
      )
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 pb-safe-area">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center px-6 py-3 mb-8 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Political Transparency</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Transparency Ledger</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Disclosing companies' actions and influence towards politics
          </p>
        </div>

        <Tabs 
          tabs={tabs} 
          defaultActiveTab="companies"
          onTabChange={handleTabChange}
          className="max-w-5xl mx-auto"
        />
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