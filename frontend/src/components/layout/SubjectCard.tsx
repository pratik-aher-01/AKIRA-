// Component stub ready for Claude
'use client'

import { useRouter } from 'next/navigation'
import type { Subject } from '@/lib/types'
import { timeAgo } from '@/lib/utils'
import ShinyText from '@/components/ui/ShinyText'
import { MessageSquare, FileText, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  subject: Subject
  onDelete?: (id: number) => void
}

export function SubjectCard({ subject, onDelete }: Props) {
  const router       = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirm,  setConfirm]  = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm) { setConfirm(true); return }
    setDeleting(true)
    onDelete?.(subject.id)
  }

  return (
    <div
      className="glass-card"
      onClick={() => router.push(`/subject/${subject.id}`)}
      style={{
        padding:  '1.25rem',
        cursor:   'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Colored top accent bar */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     '3px',
          background: `linear-gradient(90deg, ${subject.color} 0%, transparent 100%)`,
          borderRadius: '16px 16px 0 0',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        {/* Icon */}
        <div
          style={{
            width:          '44px',
            height:         '44px',
            borderRadius:   '12px',
            background:     `${subject.color}22`,
            border:         `1px solid ${subject.color}44`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '1.375rem',
          }}
        >
          {subject.icon}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: confirm ? 'rgba(239,68,68,0.15)' : 'none',
            border:     confirm ? '1px solid rgba(239,68,68,0.3)' : 'none',
            borderRadius: '8px',
            padding:    '0.3rem',
            cursor:     deleting ? 'not-allowed' : 'pointer',
            color:      confirm ? '#f87171' : 'rgba(255,255,255,0.2)',
            display:    'flex',
            transition: 'all 0.2s ease',
            fontSize:   '0.72rem',
            alignItems: 'center',
            gap:        '0.25rem',
          }}
          onMouseLeave={() => setConfirm(false)}
          title={confirm ? 'Click again to confirm delete' : 'Delete subject'}
        >
          <Trash2 size={13} />
          {confirm && <span>Confirm?</span>}
        </button>
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize:      '1rem',
          fontWeight:    700,
          fontFamily:    'var(--font-syne)',
          marginBottom:  '0.375rem',
          letterSpacing: '-0.01em',
        }}
      >
        <ShinyText
          text={subject.name}
          speed={1.2}
          delay={0.4}
          spread={140}
          color="#b5b5b5"
          shineColor="#ffffff"
          direction="left"
        />
      </h3>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginTop: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
          <FileText size={12} />
          {subject.document_count ?? 0} files
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
          <MessageSquare size={12} />
          Ask
        </span>
      </div>

      <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
        Created {timeAgo(subject.created_at)}
      </p>
    </div>
  )
}
