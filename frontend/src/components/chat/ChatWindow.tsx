'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { MessageBubble } from './MessageBubble'
import { LoadingDots } from './LoadingDots'
import type { ChatMessage } from '@/lib/types'
import { Sparkles, Brain, Zap, GitBranch, BookOpen } from 'lucide-react'

const SUGGESTIONS = [
  { icon: Brain,     text: 'Explain this concept simply' },
  { icon: Zap,       text: 'Write code for this algorithm' },
  { icon: GitBranch, text: 'Diagram the system flow' },
  { icon: BookOpen,  text: 'Summarise my notes' },
]

function EmptyState({ onSuggest }: { onSuggest?: (t: string) => void }) {
  return (
    <>
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-7px) scale(1.03); }
        }
        @keyframes ringBreath {
          0%,100% { box-shadow: 0 0 0 0 rgba(109,40,217,.35),0 0 24px rgba(109,40,217,.2); }
          50%     { box-shadow: 0 0 0 10px rgba(109,40,217,0),0 0 40px rgba(109,40,217,.35); }
        }
        @keyframes msgIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes chipIn {
          from { opacity:0; transform:translateY(6px) scale(.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center select-none">
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            animation: 'orbFloat 4s ease-in-out infinite',
          }}
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-xl">
            <Image
              src="/akira-logo.png"
              alt="Akira logo"
              fill
              sizes="56px"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
        </div>

        <div className="flex flex-col gap-2" style={{ animation: 'msgIn 0.5s 0.15s cubic-bezier(0.22,1,0.36,1) both' }}>
          <h2 className="text-xl font-bold tracking-tight text-white" style={{ fontFamily:"'Syne',sans-serif", letterSpacing:'-0.03em' }}>
            Hey, I&apos;m <span className="text-violet-400">Akira</span>
          </h2>
          <p className="text-xs leading-relaxed text-white/30 max-w-[240px] mx-auto">
            Your AI study companion. Ask me anything — I search your notes first, then the web.
          </p>
        </div>

        <div className="flex w-full max-w-[260px] items-center gap-3" style={{ animation:'msgIn 0.4s 0.3s both' }}>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[9px] uppercase tracking-[.15em] text-white/20">try asking</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[280px]">
          {SUGGESTIONS.map(({ icon: Icon, text }, i) => (
            <button
              key={text}
              onClick={() => onSuggest?.(text)}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-left transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.06] active:scale-[.98]"
              style={{ animation:`chipIn 0.35s ${0.35+i*0.07}s cubic-bezier(0.22,1,0.36,1) both`, fontFamily:"'Syne',sans-serif" }}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/10">
                <Icon size={11} className="text-violet-400 group-hover:text-violet-300 transition-colors" />
              </div>
              <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{text}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function AkiraThinking() {
  return (
    <div className="w-full" style={{ animation:'msgIn 0.2s ease-out both' }}>
      <div
        className="w-full rounded-2xl border border-white/[0.07] overflow-hidden"
        style={{ background:'rgba(255,255,255,0.025)' }}
      >
        {/* header strip */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
            style={{ background:'linear-gradient(135deg,#6d28d9,#4f46e5)', boxShadow:'0 0 12px rgba(109,40,217,.5)' }}
          >
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-[10px] font-bold tracking-[.12em] text-violet-400" style={{ fontFamily:"'Syne',sans-serif" }}>AKIRA</span>
          <div className="ml-auto flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="h-1 w-1 rounded-full bg-violet-500"
                style={{ animation:`thinkDot 1.4s ease-in-out ${i*0.16}s infinite` }} />
            ))}
          </div>
        </div>
        <div className="px-4 py-4">
          <LoadingDots />
        </div>
      </div>
    </div>
  )
}

interface Props {
  messages: ChatMessage[]
  isLoading: boolean
  onSuggest?: (text: string) => void
}

export function ChatWindow({ messages, isLoading, onSuggest }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atTop, setAtTop] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const fn = () => setAtTop(el.scrollTop > 16)
    el.addEventListener('scroll', fn)
    return () => el.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <style>{`
        @keyframes msgIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes thinkDot {
          0%,60%,100% { opacity:.25; transform:scale(.85); }
          30%          { opacity:1;   transform:scale(1); }
        }
      `}</style>

      <div className="relative flex flex-1 flex-col min-h-0" style={{ background:'#080808' }}>
        {/* top fade mask */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 transition-opacity duration-300"
          style={{ background:'linear-gradient(to bottom,#080808 0%,transparent 100%)', opacity: atTop ? 1 : 0 }}
        />

        <div
          ref={scrollRef}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 pt-4 min-h-0"
          style={{ scrollbarWidth:'none' }}
        >
          {messages.length === 0 && !isLoading && <EmptyState onSuggest={onSuggest} />}
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          {isLoading && <AkiraThinking />}
          <div ref={bottomRef} className="h-px" />
        </div>
      </div>
    </>
  )
}
