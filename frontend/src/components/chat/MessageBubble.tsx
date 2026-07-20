'use client'

import { AnswerCard } from './AnswerCard'
import { SourceBadge } from './SourceBadge'
import { LoadingDots } from './LoadingDots'
import type { ChatMessage } from '@/lib/types'
import { timeAgo } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface Props {
  message: ChatMessage
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading = false }: Props) {
  const isUser = message.role === 'user'

  /* ── User bubble ── right-aligned pill */
  if (isUser) {
    return (
      <div
        className="flex justify-end"
        style={{ animation:'msgIn 0.2s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <div className="flex flex-col items-end gap-1 max-w-[75%]">
          <div
            className="px-4 py-2.5 text-sm leading-relaxed text-white/90 break-words"
            style={{
              background: 'rgba(109,40,217,0.22)',
              border: '1px solid rgba(109,40,217,0.32)',
              borderRadius: '14px 4px 14px 14px',
              fontFamily: "'DM Sans', 'Syne', sans-serif",
              fontWeight: 400,
            }}
          >
            {message.content}
          </div>
          <span
            className="text-[10px] text-white/20 pr-1"
            style={{ fontFamily:"'Syne',sans-serif" }}
          >
            {timeAgo(message.created_at)}
          </span>
        </div>
      </div>
    )
  }

  /* ── AI card ── full width, card layout matching wireframe */
  return (
    <div
      className="w-full"
      style={{ animation:'msgIn 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      <div
        className="w-full rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{ background:'rgba(255,255,255,0.028)' }}
      >

        {/* ── Card header strip ── */}
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.06]"
          style={{ background:'rgba(255,255,255,0.02)' }}
        >
          {/* Avatar */}
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: 'linear-gradient(135deg,#6d28d9 0%,#4f46e5 100%)',
              boxShadow: '0 0 10px rgba(109,40,217,0.45)',
            }}
          >
            <Sparkles size={12} className="text-white" />
          </div>

          {/* Name */}
          <span
            className="text-[10px] font-bold tracking-[0.14em] text-violet-400"
            style={{ fontFamily:"'Syne',sans-serif" }}
          >
            AKIRA
          </span>

          {/* Source badge */}
          {!isLoading && message.source && (
            <SourceBadge source={message.source} chunksUsed={message.chunks_used} />
          )}

          {/* Timestamp pushed right */}
          {!isLoading && (
            <span
              className="ml-auto text-[10px] text-white/20"
              style={{ fontFamily:"'Syne',sans-serif" }}
            >
              {timeAgo(message.created_at)}
            </span>
          )}
        </div>

        {/* ── Card body ── full width prose */}
        <div
          className="px-4 py-4 text-sm leading-relaxed"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          {isLoading
            ? <LoadingDots />
            : <AnswerCard content={message.content} />
          }
        </div>

      </div>
    </div>
  )
}