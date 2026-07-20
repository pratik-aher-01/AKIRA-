'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import GradientText from '@/components/ui/GradientText'
import { Menu } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // 1. Auto-close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // 2. Lock body scroll when sidebar is open on mobile to prevent background swiping
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  return (
    // Used 100dvh to prevent mobile browser address bar from cutting off the bottom
    <div className="flex h-[100dvh] w-full bg-black text-white overflow-hidden relative selection:bg-violet-500/30">
      
      {/* Mobile Overlay Background - Fades in via CSS rather than unmounting for smoother 60fps animation */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sliding Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[320px] transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main App Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
        
        {/* Global Mobile Header - Strictly md:hidden so it doesn't clash with desktop sidebar branding */}
        {/* Global Mobile Header */}
        <header className="md:hidden relative flex items-center justify-between px-4 h-16 flex-shrink-0 z-30 bg-gradient-to-b from-[#0a0a0a] to-transparent border-b border-white/[0.07]">
          
          {/* 1. Left: Hamburger Button */}
          <div className="flex items-center z-10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* 2. Center: Logo & Title (Absolutely centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 pointer-events-none">
            <GradientText
              className="font-syne font-bold text-xl tracking-tight"
              colors={['#a685ff', '#60a5fa', '#f9a8d4']}
              animationSpeed={6}
            >
              Akira
            </GradientText>
          </div>

          {/* 3. Right: Empty placeholder to balance the flex container */}
          <div className="w-10 z-10" aria-hidden="true"></div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
