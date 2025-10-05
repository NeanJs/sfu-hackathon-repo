'use client'

import { useMemo, useState } from 'react'
import CompanyDirectory from '../components/company-directory/CompanyDirectory'
import Tabs, { type Tab } from '../components/tabs/Tabs'
import type { Company } from '../components/company-directory/data'
import { useButtonBarActions } from '../components/button-bar/ButtonBarProvider'
import { UserForm } from '../components/userform'
import { InfoCard } from '../components/infocard'
import { BarChart } from '../components/barchart'
import { Histogram } from '../components/histogram'

export default function DemoPage() {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([])
  const [singleSelectedCompanies, setSingleSelectedCompanies] = useState<Company[]>([])
  const [activeTab, setActiveTab] = useState('company-directory-basic')

  const handleSelectionChange = (companies: Company[]) => {
    setSelectedCompanies(companies)
    console.log('Selected companies:', companies)
  }

  const handleSingleSelectionChange = (companies: Company[]) => {
    setSingleSelectedCompanies(companies)
    console.log('Single selected companies:', companies)
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
    
    if (activeTab === 'company-directory-single-select') {
      return [
        {
          id: 'clear-single-selection',
          label: 'Clear Selection',
          variant: 'secondary' as const,
          onClick: () => setSingleSelectedCompanies([]),
          disabled: singleSelectedCompanies.length === 0
        },
        {
          id: 'export-single-selected',
          label: `Export (${singleSelectedCompanies.length})`,
          onClick: () => console.log('Exporting:', singleSelectedCompanies),
          disabled: singleSelectedCompanies.length === 0
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
  }, [activeTab, selectedCompanies, singleSelectedCompanies])

  useButtonBarActions(buttonBarActions)

  const tabs: Tab[] = [
    {
      id: 'infocard-demo',
      label: 'InfoCard',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">InfoCard</h2>
            <p className="text-muted-foreground">Mobile-first, responsive info card with media and children</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-elevated p-0">
              <InfoCard
                data={{
                  id: 'hard-coded',
                  title: 'Hard-coded InfoCard',
                  body: 'Uses directly provided data and supports embedding other components as children.',
                  media: [
                    {
                      kind: 'image',
                      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                      alt: 'Mountains',
                      aspectRatio: '16/9'
                    }
                  ]
                }}
              >
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-primary">Primary Action</button>
                  <button className="btn-secondary">Secondary</button>
                </div>
              </InfoCard>
            </div>
            <div className="card-elevated p-0">
              <InfoCard id="demo-infocard" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'userform-demo',
      label: 'UserForm',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">UserForm</h2>
            <p className="text-muted-foreground">Mobile-first, multi-step form with bottom button bar</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <UserForm formId="demo-user-form" />
          </div>
        </div>
      )
    },
    {
      id: 'company-directory-basic',
      label: 'Company Directory',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Company Directory</h2>
            <p className="text-muted-foreground">Basic company directory with search and filtering</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
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
          <div className="card-elevated p-3 sm:p-4">
            <CompanyDirectory selectable={true} multiselect={true} onSelectionChange={handleSelectionChange} />
          </div>
          {selectedCompanies.length > 0 && (
            <div className="card-elevated p-3 sm:p-4">
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
      id: 'company-directory-single-select',
      label: 'Single Select Directory',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Single Select Company Directory</h2>
            <p className="text-muted-foreground">Company directory with single selection mode</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <CompanyDirectory selectable={true} multiselect={false} onSelectionChange={handleSingleSelectionChange} />
          </div>
          {singleSelectedCompanies.length > 0 && (
            <div className="card-elevated p-3 sm:p-4">
              <h3 className="text-lg font-semibold mb-3">Selected Company ({singleSelectedCompanies.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {singleSelectedCompanies.map((company) => (
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
          <div className="card-elevated p-3 sm:p-4">
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
      id: 'barchart-demo',
      label: 'BarChart',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">BarChart Component</h2>
            <p className="text-muted-foreground">Mobile-first responsive SVG bar chart with sorting and data labels</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-elevated p-3 sm:p-4">
              <BarChart
                title="Revenue by Company"
                data={[
                  { category: 'TechCorp', value: 2500000 },
                  { category: 'Alpha Industries', value: 1800000 },
                  { category: 'Beta Solutions', value: 1200000 },
                  { category: 'Gamma Enterprises', value: 900000 },
                  { category: 'Delta Corp', value: 600000 },
                ]}
                xTitle="Companies"
                yTitle="Revenue"
                unit="$"
                sort="value-desc"
                barColor="#2563eb"
              />
            </div>
            
            <div className="card-elevated p-3 sm:p-4">
              <BarChart
                title="User Engagement"
                data={[
                  { category: 'Mobile App', value: 38000 },
                  { category: 'Web Platform', value: 32000 },
                  { category: 'Desktop Software', value: 28000 },
                  { category: 'API Usage', value: 15000 },
                  { category: 'Third-party Integration', value: 8000 },
                ]}
                xTitle="Platforms"
                yTitle="Active Users"
                unit="users"
                sort="value-desc"
                barColor="#059669"
              />
            </div>
            
            <div className="card-elevated p-3 sm:p-4">
              <BarChart
                title="Monthly Sales (Log Scale)"
                data={[
                  { category: 'Apr', value: 1 },
                  { category: 'Feb', value: 500 },
                  { category: 'Jan', value: 100 },
                  { category: 'Jun', value: 2000 },
                  { category: 'Mar', value: 2000 },
                  { category: 'May', value: 2000 },
                ]}
                xTitle="Month"
                yTitle="Sales"
                unit="units"
                logScale={true}
                sort="none"
                barColor="#dc2626"
              />
            </div>
            
            <div className="card-elevated p-3 sm:p-4">
              <BarChart
                title="Customer Satisfaction"
                data={[
                  { category: 'Very Satisfied', value: 80 },
                  { category: 'Satisfied', value: 12 },
                  { category: 'Neutral', value: 2 },
                  { category: 'Dissatisfied', value: 1 },
                  { category: 'Very Dissatisfied', value: 0 },
                ]}
                xTitle="Satisfaction Level"
                yTitle="Percentage"
                unit="%"
                sort="value-desc"
                barColor="#7c3aed"
                maxValue={100}
              />
            </div>
          </div>
          
          <div className="card-elevated p-3 sm:p-4">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Zero baseline (unless log scale)</li>
                <li>• Meaningful sorting (by value or alphabetically)</li>
                <li>• Clear axis titles with units</li>
                <li>• Wrapped/tilted labels for long text</li>
                <li>• Consistent bar width and gaps</li>
                <li>• Data labels for exact values</li>
              </ul>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mobile-first responsive design</li>
                <li>• SVG-based rendering</li>
                <li>• Optional log scale</li>
                <li>• Customizable colors and styling</li>
                <li>• Grid lines and baseline</li>
                <li>• Self-contained component</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'histogram-demo',
      label: 'Histogram',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Histogram Component</h2>
            <p className="text-muted-foreground">Mobile-first responsive histogram with explicit bins and count/density scaling</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-elevated p-3 sm:p-4">
              <Histogram
                title="Sales Distribution (Count)"
                series={[
                  { 
                    id: 'Q1 Sales', 
                    values: [1.2, 1.5, 1.8, 2.1, 2.3, 2.7, 3.0, 3.2, 3.5, 3.8, 4.1, 4.3, 4.7, 5.0, 5.2],
                    color: '#2563eb'
                  },
                  { 
                    id: 'Q2 Sales', 
                    values: [1.0, 1.3, 1.6, 1.9, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7, 4.0, 4.3, 4.6, 4.9, 5.2],
                    color: '#10b981'
                  }
                ]}
                bins={{ binWidth: 1.5, domain: [0.5, 5.5] }}
                yScale="count"
                xTitle="Sales Amount"
                yTitle="Frequency"
                unit="$M"
                height={500}
              />
            </div>
            
            <div className="card-elevated p-3 sm:p-4">
              <Histogram
                title="Response Times (Density)"
                series={[
                  { 
                    id: 'API Calls', 
                    values: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450],
                    color: '#f59e0b'
                  }
                ]}
                bins={{ binWidth: 100, domain: [25, 475] }}
                yScale="density"
                xTitle="Response Time"
                yTitle="Density"
                unit="ms"
                height={500}
              />
            </div>
            
            <div className="card-elevated p-3 sm:p-4">
              <Histogram
                title="Customer Satisfaction Scores"
                series={[
                  { 
                    id: 'Mobile Users', 
                    values: [3.2, 3.5, 3.8, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0],
                    color: '#8b5cf6'
                  },
                  { 
                    id: 'Desktop Users', 
                    values: [3.0, 3.3, 3.6, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8],
                    color: '#ef4444'
                  }
                ]}
                bins={{ binEdges: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5] }}
                yScale="count"
                xTitle="Satisfaction Score"
                yTitle="Count"
                unit="stars"
                height={500}
              />
            </div>
            
            <div className="card-elevated p-3 sm:p-4">
              <Histogram
                title="Revenue Distribution (Density)"
                series={[
                  { 
                    id: 'Enterprise', 
                    values: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
                    color: '#06b6d4'
                  },
                  { 
                    id: 'SMB', 
                    values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
                    color: '#84cc16'
                  }
                ]}
                bins={{ binWidth: 200, domain: [0, 900] }}
                yScale="density"
                xTitle="Revenue"
                yTitle="Density"
                unit="$K"
                height={500}
              />
            </div>
          </div>
          
          <div className="card-elevated p-3 sm:p-4">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Explicit bin width or bin edges</li>
                <li>• Shared bins across multiple series</li>
                <li>• Count vs density scaling</li>
                <li>• Stacked multi-series visualization</li>
                <li>• Responsive SVG rendering</li>
                <li>• Built-in legend and grid lines</li>
              </ul>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mobile-first responsive design</li>
                <li>• Customizable colors per series</li>
                <li>• Axis labels with units</li>
                <li>• Self-contained component</li>
                <li>• Consistent binning for comparisons</li>
                <li>• Density normalization support</li>
              </ul>
            </div>
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
          <div className="card-elevated p-3 sm:p-4">
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-black">Component Showcase</span>
          </h1>
          <p className="text-xl font-semibold text-black max-w-2xl mx-auto leading-relaxed">
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
