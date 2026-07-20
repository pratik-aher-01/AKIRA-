import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import './globals.css'
import '../styles/glass.css'
import 'katex/dist/katex.min.css'

const syne = Syne({
  subsets:  ['latin'],
  variable: '--font-syne',
  weight:   ['400', '500', '600', '700', '800'],
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'Akira — AI Study Companion',
  description: 'Your personal AI that studies your notes and answers questions as a technical expert.',
  icons: { icon: '/akira-logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body>
        {/* Ambient background orbs */}
        <div className="bg-orb bg-orb-purple" aria-hidden="true" />
        <div className="bg-orb bg-orb-blue"   aria-hidden="true" />

        {/* Main app content sits above orbs */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
