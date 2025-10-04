'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultActiveTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export default function Tabs({ tabs, defaultActiveTab, onTabChange, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  const scrollToTab = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }, [])

  const scrollToActiveTab = useCallback(() => {
    const activeTabElement = tabRefs.current.get(activeTab)
    const container = scrollContainerRef.current
    if (!activeTabElement || !container) return

    const containerRect = container.getBoundingClientRect()
    const tabRect = activeTabElement.getBoundingClientRect()
    const tabLeft = tabRect.left - containerRect.left + container.scrollLeft
    const tabRight = tabLeft + tabRect.width
    const containerScrollLeft = container.scrollLeft
    const containerScrollRight = containerScrollLeft + container.clientWidth

    if (tabLeft < containerScrollLeft) {
      container.scrollTo({
        left: tabLeft - 16,
        behavior: 'smooth'
      })
    } else if (tabRight > containerScrollRight) {
      container.scrollTo({
        left: tabRight - container.clientWidth + 16,
        behavior: 'smooth'
      })
    }
  }, [activeTab])

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }, [onTabChange])

  useEffect(() => {
    updateScrollButtons()
    scrollToActiveTab()
  }, [updateScrollButtons, scrollToActiveTab])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => updateScrollButtons()
    container.addEventListener('scroll', handleScroll)
    
    const resizeObserver = new ResizeObserver(() => {
      updateScrollButtons()
      scrollToActiveTab()
    })
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [updateScrollButtons, scrollToActiveTab])

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  if (tabs.length === 0) return null

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div className="flex items-center">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollToTab('left')}
              className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Scroll tabs left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}
          
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollToTab('right')}
              className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Scroll tabs right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-1 px-2 sm:px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el)
                }}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={[
                  'flex-shrink-0 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 whitespace-nowrap',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent'
                ].join(' ')}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4" role="tabpanel" aria-labelledby={activeTab}>
        {activeTabContent}
      </div>
    </div>
  )
}
