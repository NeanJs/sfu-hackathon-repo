'use client'

import { useState } from 'react'
import CompanyDirectory from './components/company-directory/CompanyDirectory'
import type { Company } from './components/company-directory/data'
import Image from 'next/image'
import About from './components/about/About'
import Testimonials from './components/testimonials/Testimonials'
import HelpCenter from './components/help-center/HelpCenter'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setShowDropdown(false)
    console.log('Active tab changed to:', tabId)
  }

  const tabs = {
    home: (
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-8">
        <div className="text-left max-w-2xl">
          <h1 className="text-5xl md:text-6xl text-white font-bold mb-6 leading-tight">
            Make Ethical, Value-Aligned Choices with Confidence
          </h1>
          <p className="text-xl xl:text-2xl text-white mb-4">
            Discover companies that truly match your social, environmental, and economic beliefs.
          </p>
          <p className="text-lg xl:text-xl text-white mb-6 leading-relaxed">
            Leadger is the ethical consumer app that helps you spend and invest in companies aligned with your values. Take our free quiz today and receive personalized insights that empower your everyday ethical choices.
          </p>
          <button
            className="px-6 py-3 text-lg font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
            onClick={() => alert('Quiz started!')}
          >
            Start Your Free Quiz Now
          </button>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/landing-image1.jpg"
            alt="Landing visual"
            width={450}
            height={450}
            className="rounded-xl shadow-xl"
            priority
          />
        </div>
      </div>
    ),
    companies: (
      <div className="card-elevated p-4">
        <CompanyDirectory selectable={false} />
      </div>
    ),
    testimonials: <Testimonials />,
    settings: (
      <div className="card-elevated p-4">
        <h2 className="text-3xl font-bold text-center text-black">Settings</h2>
        <p className="text-lg text-muted-foreground">Configure your preferences and notifications</p>
      </div>
    ),
    about: <About />,
    help: <HelpCenter />
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'companies', label: 'Companies' },
    { id: 'testimonials', label: 'Testimonials' }
  ]

  return (
    <>
      <main
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-logo2.jpeg')" }}
      />
      <div className="fixed inset-0 bg-black/60 z-0" />

      <div className="relative z-10 min-h-screen overflow-auto flex flex-col">
        <header className="flex items-center justify-between px-8 py-6 bg-white shadow-md">
          <button
            onClick={() => handleTabChange('home')}
            className="flex-shrink-0 focus:outline-none"
            aria-label="Go to Home"
          >
            <Image
              src="/leadger.tech-logo.jpg"
              alt="Leadger.tech Logo"
              width={250}
              height={250}
              className="rounded-full"
              priority
            />
          </button>

          <nav className="flex-grow flex justify-center gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`px-3 py-2 rounded-lg text-lg font-medium border transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="relative flex items-center gap-2">
            <button
              onClick={() => alert('Sign In clicked!')}
              className="px-3 py-2 rounded-lg border transition-all duration-200 bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent"
              aria-label="Sign In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4-4m-4 4l4 4m13-4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
              className="px-5 py-2 text-lg font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
              onClick={() => alert('Sign Up clicked!')}
            >
              SIGN UP
            </button>

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                activeTab === 'help' || activeTab === 'about' || activeTab === 'testimonials'
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent'
              }`}
              aria-label="Help & More"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.227 9a3.75 3.75 0 117.546 1.5c-.315.627-.89 1.09-1.574 1.5-.684.41-1.199.873-1.199 2.25M12 18h.01" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                <button onClick={() => handleTabChange('help')} className="w-full text-left px-4 py-2 hover:bg-gray-100">Help & Support</button>
                <button onClick={() => handleTabChange('about')} className="w-full text-left px-4 py-2 hover:bg-gray-100">About</button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleTabChange('settings')}
            className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background/80 text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent'
            }`}
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
              />
            </svg>
          </button>
        </header>

        <section className="max-w-6xl mx-auto mt-8 px-4 flex-grow">
          {tabs[activeTab]}
        </section>

        <footer className="bg-gray-900 text-white mt-12 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold">Leadger.tech</h4>
              <p className="text-sm text-gray-400 mt-1">Empowering ethical choices through transparency.</p>
            </div>
            <div className="flex gap-6 text-sm">
              <button
  onClick={() => handleTabChange('about')}
  className="hover:text-orange-400 transition text-sm"
>
  About
</button>
<button
  onClick={() => handleTabChange('help')}
  className="hover:text-orange-400 transition text-sm"
>
  Contact
</button>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 mt-6">
            &copy; {new Date().getFullYear()} Leadger.tech. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  )
}
