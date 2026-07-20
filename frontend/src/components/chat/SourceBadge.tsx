'use client'

import type { SourceType } from '@/lib/types'
import { SOURCE_CONFIG } from '@/lib/utils'
import { BookOpen, Globe, Shuffle } from 'lucide-react'

interface Props {
  source: SourceType
  chunksUsed?: number
}

const ICONS: Record<SourceType, React.ReactNode> = {
  notes: <BookOpen size={10} />,
  web:   <Globe size={10} />,
  mixed: <Shuffle size={10} />,
}

export function SourceBadge({ source, chunksUsed }: Props) {
  const cfg = SOURCE_CONFIG[source]

  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontFamily: "'Syne', sans-serif",
        letterSpacing: '0.04em',
      }}
    >
      {ICONS[source]}
      {cfg.label}
      {source === 'notes' && chunksUsed !== undefined && (
        <span className="opacity-50">· {chunksUsed}</span>
      )}
    </span>
  )
}