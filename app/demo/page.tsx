'use client'

import CompanyDirectory from '../components/company-directory/CompanyDirectory'
import Tabs, { type Tab } from '../components/tabs/Tabs'
import type { Company } from '../components/company-directory/data'

export default function DemoPage() {
  const handleSelectionChange = (selectedCompanies: Company[]) => {
    console.log('Selected companies:', selectedCompanies)
  }

  const handleTabChange = (tabId: string) => {
    console.log('Active tab changed to:', tabId)
  }

  const tabs: Tab[] = [
    {
      id: 'company-directory-basic',
      label: 'Company Directory',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Company Directory</h2>
            <p className="text-muted-foreground">Basic company directory with search and filtering</p>
          </div>
          <div className="card-elevated p-4 sm:p-6">
            <CompanyDirectory selectable={false} />
          </div>
        </div>
      )
    },
    {
      id: 'company-directory-selectable',
      label: 'Selectable Directory',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Selectable Company Directory</h2>
            <p className="text-muted-foreground">Company directory with selection capabilities</p>
          </div>
          <div className="card-elevated p-4 sm:p-6">
            <CompanyDirectory selectable={true} onSelectionChange={handleSelectionChange} />
          </div>
        </div>
      )
    },
    {
      id: 'tabs-component',
      label: 'Tabs Component',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Tabs Component</h2>
            <p className="text-muted-foreground">Scrollable tabs with responsive design</p>
          </div>
          <div className="card-elevated p-4 sm:p-6">
            <Tabs 
              tabs={[
                {
                  id: 'tab1',
                  label: 'First Tab',
                  content: (
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">First Tab Content</h3>
                      <p className="text-muted-foreground">This is the content of the first tab.</p>
                    </div>
                  )
                },
                {
                  id: 'tab2',
                  label: 'Second Tab',
                  content: (
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Second Tab Content</h3>
                      <p className="text-muted-foreground">This is the content of the second tab.</p>
                    </div>
                  )
                },
                {
                  id: 'tab3',
                  label: 'Third Tab',
                  content: (
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Third Tab Content</h3>
                      <p className="text-muted-foreground">This is the content of the third tab.</p>
                    </div>
                  )
                },
                {
                  id: 'tab4',
                  label: 'Fourth Tab',
                  content: (
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Fourth Tab Content</h3>
                      <p className="text-muted-foreground">This is the content of the fourth tab.</p>
                    </div>
                  )
                },
                {
                  id: 'tab5',
                  label: 'Fifth Tab',
                  content: (
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Fifth Tab Content</h3>
                      <p className="text-muted-foreground">This is the content of the fifth tab.</p>
                    </div>
                  )
                }
              ]}
              defaultActiveTab="tab1"
            />
          </div>
        </div>
      )
    },
    {
      id: 'component-features',
      label: 'Component Features',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Component Features</h2>
            <p className="text-muted-foreground">Overview of available component features and capabilities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-3">Company Directory Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Search functionality with debounced input</li>
                <li>• Category filtering</li>
                <li>• Infinite scroll pagination</li>
                <li>• Company logo display with fallback</li>
                <li>• Selection mode (optional)</li>
                <li>• Responsive grid layout</li>
                <li>• Accessibility features</li>
              </ul>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-3">Tabs Component Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Horizontal scrolling tabs</li>
                <li>• Scroll navigation buttons</li>
                <li>• Responsive design</li>
                <li>• Keyboard navigation</li>
                <li>• Customizable styling</li>
                <li>• Tab change callbacks</li>
                <li>• Accessibility compliant</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center px-6 py-3 mb-8 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Component Demo</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Component Showcase</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore all available components and their features
          </p>
        </div>

        <Tabs 
          tabs={tabs} 
          defaultActiveTab="company-directory-basic"
          onTabChange={handleTabChange}
          className="max-w-6xl mx-auto"
        />
      </div>
    </main>
  )
}
