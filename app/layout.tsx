import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ButtonBarProvider } from './components/button-bar/ButtonBarProvider'
import ButtonBar from './components/button-bar/ButtonBar'
import { SearchOverlayProvider } from './components/search-overlay/SearchOverlayProvider'
import SearchOverlay from './components/search-overlay/SearchOverlay'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Transparency Ledger',
  description: 'Disclosing companies\' actions towards politics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SearchOverlayProvider>
          <ButtonBarProvider>
            {children}
            <ButtonBar />
            <SearchOverlay />
          </ButtonBarProvider>
        </SearchOverlayProvider>
      </body>
    </html>
  )
}