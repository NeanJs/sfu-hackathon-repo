'use client'

import { useMemo, useState } from 'react'
import CompanyDirectory from '../components/company-directory/CompanyDirectory'
import Tabs, { type Tab } from '../components/tabs/Tabs'
import type { Company } from '../components/company-directory/data'
import { useButtonBarActions } from '../components/button-bar/ButtonBarProvider'

export default function DemoPage() {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([])
  const [activeTab, setActiveTab] = useState('company-directory-basic')

  const handleSelectionChange = (companies: Company[]) => {
    setSelectedCompanies(companies)
    console.log('Selected companies:', companies)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    console.log('Active tab changed to:', tabId)
  }

  const buttonBarActions = useMemo(() => {
    if (activeTab === 'company-directory-selectable') {
      return [
        {
          id: 'clear-selection',
          label: 'Clear Selection',
          variant: 'secondary' as const,
          onClick: () => setSelectedCompanies([]),
          disabled: selectedCompanies.length === 0
        },
        {
          id: 'export-selected',
          label: `Export (${selectedCompanies.length})`,
          onClick: () => console.log('Exporting:', selectedCompanies),
          disabled: selectedCompanies.length === 0
        }
      ]
    }
    
    if (activeTab === 'button-bar-demo') {
      return [
        {
          id: 'action-1',
          label: 'Action 1',
          variant: 'secondary' as const,
          onClick: () => alert('Action 1 clicked!')
        },
        {
          id: 'action-2',
          label: 'Action 2',
          onClick: () => alert('Action 2 clicked!')
        },
        {
          id: 'action-3',
          label: 'Action 3',
          onClick: () => alert('Action 3 clicked!')
        }
      ]
    }

    return null
  }, [activeTab, selectedCompanies])

  useButtonBarActions(buttonBarActions)

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
          {selectedCompanies.length > 0 && (
            <div className="card-elevated p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-3">Selected Companies ({selectedCompanies.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCompanies.map((company) => (
                  <div key={company.id} className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg">
                    <span className="text-sm font-medium">{company.name}</span>
                    <span className="text-xs text-muted-foreground">({company.category})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
      id: 'button-bar-demo',
      label: 'Button Bar Demo',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Button Bar Component</h2>
            <p className="text-muted-foreground">Fixed bottom button bar with responsive design</p>
          </div>
          <div className="card-elevated p-4 sm:p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fixed bottom positioning with overlay</li>
                <li>• Mobile-first responsive design</li>
                <li>• Equal-width button distribution</li>
                <li>• Primary and secondary button variants</li>
                <li>• Disabled state support</li>
                <li>• Auto-hide when no actions</li>
                <li>• Safe area padding for mobile devices</li>
              </ul>
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary font-medium mb-2">Try the buttons below!</p>
                <p className="text-sm text-muted-foreground">The button bar appears at the bottom of the screen with 3 example actions.</p>
              </div>
            </div>
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
            <div className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-3">Button Bar Component Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Global state management</li>
                <li>• Context-based communication</li>
                <li>• Mobile-first responsive design</li>
                <li>• Fixed bottom overlay positioning</li>
                <li>• Equal-width button distribution</li>
                <li>• Primary/secondary variants</li>
                <li>• Disabled state support</li>
                <li>• Auto-hide functionality</li>
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
