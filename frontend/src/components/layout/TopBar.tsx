'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Subject } from '@/lib/types'
import ShinyText from '@/components/ui/ShinyText'
import { 
  ArrowLeft, 
  Upload, 
  Zap, 
  Trash2, 
  Settings, 
  Download,
  LayoutGrid // The new "cool" icon
} from 'lucide-react'
import { useChatStore } from '@/store/chatStore'

interface Props {
  subject: Subject
  onClearChat?: () => void
}

export function TopBar({ subject, onClearChat }: Props) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Grab only the active subject's messages from the Zustand store
  const messages = useChatStore((state) => state.messagesBySubject[subject.id] ?? [])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Export Function
  const handleExportChat = () => {
    setIsMenuOpen(false) 
    
    if (messages.length === 0) {
      alert("There are no messages to export yet!")
      return
    }

    const defaultName = `${subject.name.replace(/\s+/g, '_')}_Notes`
    const fileName = window.prompt("Enter a name for your text file:", defaultName)
    
    if (!fileName) return

    let textContent = `--- Akira Study Session: ${fileName} ---\nSubject: ${subject.name}\n\n`
    
    messages.forEach((msg) => {
      const sender = msg.role === 'user' ? 'You' : 'Akira'
      textContent += `${sender}:\n${msg.content}\n\n`
      if (msg.source && msg.role === 'assistant') {
         textContent += `[Source: ${msg.source}]\n\n`
      }
      textContent += `--------------------------------------------------\n\n`
    })

    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-16 shrink-0 bg-[#0a0c10]/80 backdrop-blur-xl border-b border-white/[0.04] z-30 sticky top-0">
      
      {/* Left: Back Arrow & Subject Info */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all active:scale-95 shrink-0"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={16} className="text-white/60" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-sm shrink-0 border"
            style={{ 
              backgroundColor: `${subject.color}15`, 
              borderColor: `${subject.color}30`
            }}
          >
            {subject.icon}
          </div>
          <h1 className="text-base md:text-lg font-bold text-white/90 font-syne truncate tracking-tight">
            <ShinyText
              text={subject.name}
              speed={1.2}
              delay={0.4}
              spread={140}
              color="#b5b5b5"
              shineColor="#ffffff"
              direction="left"
            />
          </h1>
        </div>
      </div>

      {/* Right: The Trigger and the Pop-out Menu */}
      <div className="relative flex items-center" ref={menuRef}>
        
        {/* The Trigger Icon */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/10 transition-all active:scale-95 text-white/70 hover:text-white shrink-0 shadow-sm"
        >
          <LayoutGrid size={18} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-90' : 'rotate-0 scale-100'}`} />
        </button>

        {/* The Floating Glass Menu */}
        <div 
          className={`absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 overflow-hidden flex flex-col p-1.5 transition-all duration-300 origin-top-right
            ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'}
          `}
        >
          
          {/* Quiz Action */}
          <button 
            onClick={() => {
              setIsMenuOpen(false)
              router.push(`/quiz/${subject.id}`)
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-300 hover:bg-white/[0.06] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Zap size={14} className="text-blue-400" />
            </div>
            Generate Quiz
          </button>

          {/* Upload Action */}
          <button 
            onClick={() => {
              setIsMenuOpen(false)
              router.push(`/upload?subject=${subject.id}`)
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-300 hover:bg-white/[0.06] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <Upload size={14} className="text-white/70" />
            </div>
            Upload Notes
          </button>

          {/* Settings Action */}
          <button 
            onClick={() => {
              setIsMenuOpen(false)
              router.push('/settings')
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-300 hover:bg-white/[0.06] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-800/50 flex items-center justify-center shrink-0">
              <Settings size={14} className="text-zinc-400" />
            </div>
            Akira Settings
          </button>

          <div className="h-px bg-white/[0.06] my-1 mx-2" />

          {/* Export Chat */}
          <button 
            onClick={handleExportChat}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-300 hover:bg-violet-500/10 hover:text-violet-200 transition-colors text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 flex items-center justify-center shrink-0 transition-colors">
              <Download size={14} className="text-violet-400" />
            </div>
            Export as .txt
          </button>

          {/* Clear Chat */}
          {onClearChat && (
            <button 
              onClick={() => {
                setIsMenuOpen(false)
                onClearChat()
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center shrink-0 transition-colors">
                <Trash2 size={14} className="text-red-400" />
              </div>
              Clear Chat History
            </button>
          )}

        </div>
      </div>
    </header>
  )
}
