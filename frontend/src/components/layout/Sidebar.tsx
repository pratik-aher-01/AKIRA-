// Component stub ready for Claude
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSubjectStore } from '@/store/subjectStore'
import { useSubjects } from '@/hooks/useSubjects'
import { useState } from 'react'
import { Brand } from '@/components/layout/Brand'
import {
  Home, Upload, Plus, X, ChevronRight, Settings
} from 'lucide-react'
import { SUBJECT_COLORS, SUBJECT_ICONS } from '@/lib/utils'
import type { CreateSubjectPayload } from '@/lib/types'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose: _onClose }: SidebarProps) {
  const pathname  = usePathname()
  const router    = useRouter()
  const subjects  = useSubjectStore((s) => s.subjects)
  const { create } = useSubjects()

  const [showNew,   setShowNew]   = useState(false)
  const [newName,   setNewName]   = useState('')
  const [newColor,  setNewColor]  = useState(SUBJECT_COLORS[0])
  const [newIcon,   setNewIcon]   = useState(SUBJECT_ICONS[0])
  const [creating,  setCreating]  = useState(false)

  const handleCreate = async () => {
    if (!newName.trim() || creating) return
    setCreating(true)
    try {
      const subject = await create({ name: newName.trim(), color: newColor, icon: newIcon })
      setShowNew(false)
      setNewName('')
      router.push(`/subject/${subject.id}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <aside
      className="glass-sidebar"
      style={{
        background:     '#13171c',
        width:          'var(--sidebar-w)',
        height:         '100vh',
        display:        'flex',
        flexDirection:  'column',
        flexShrink:     0,
        position:       'sticky',
        top:            0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding:      '1.25rem 1rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink:   0,
        }}
      >
        <Brand />
      </div>

      {/* Nav */}
      <nav style={{ padding: '0.75rem 0.625rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Main links */}
        <div style={{ marginBottom: '1.25rem', flexShrink: 0 }}>
          <Link href="/" className={`nav-item${pathname === '/' ? ' active' : ''}`}>
            <Home size={15} /> Dashboard
          </Link>
          <Link href="/upload" className={`nav-item${pathname === '/upload' ? ' active' : ''}`}>
            <Upload size={15} /> Upload Notes
          </Link>
        </div>

        {/* Subjects Header */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '0 0.5rem',
              marginBottom:   '0.375rem',
            }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Subjects
            </span>
            <button
              onClick={() => setShowNew((v) => !v)}
              style={{
                background: 'none',
                border:     'none',
                cursor:     'pointer',
                padding:    '0.15rem',
                color:      'rgba(255,255,255,0.3)',
                display:    'flex',
                borderRadius: '4px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(166,133,255,0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              title="Add subject"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* New subject inline form */}
          {showNew && (
            <div
              style={{
                background:   'rgba(124,58,237,0.1)',
                border:       '1px solid rgba(124,58,237,0.2)',
                borderRadius: '12px',
                padding:      '0.75rem',
                marginBottom: '0.5rem',
                animation:    'slideUp 0.2s ease-out',
              }}
            >
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Subject name…"
                className="glass-input"
                style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.82rem', marginBottom: '0.5rem' }}
              />

              {/* Icon picker */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {SUBJECT_ICONS.slice(0, 8).map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setNewIcon(ic)}
                    style={{
                      width:        '28px',
                      height:       '28px',
                      fontSize:     '0.9rem',
                      borderRadius: '6px',
                      border:       newIcon === ic ? '1px solid rgba(124,58,237,0.6)' : '1px solid transparent',
                      background:   newIcon === ic ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                      cursor:       'pointer',
                    }}
                  >
                    {ic}
                  </button>
                ))}
              </div>

              {/* Color picker */}
              <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.625rem' }}>
                {SUBJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    style={{
                      width:        '18px',
                      height:       '18px',
                      borderRadius: '50%',
                      background:   c,
                      border:       newColor === c ? '2px solid #fff' : '2px solid transparent',
                      cursor:       'pointer',
                      flexShrink:   0,
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.375rem 0.5rem', fontSize: '0.78rem' }}
                >
                  {creating ? 'Creating…' : 'Create'}
                </button>
                <button
                  onClick={() => { setShowNew(false); setNewName('') }}
                  className="btn-glass"
                  style={{ padding: '0.375rem 0.5rem' }}
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subject list - Scrollable area */}
        <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1, overflowY: 'auto' }}>
          {subjects.length === 0 && !showNew && (
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)', padding: '0.5rem', textAlign: 'center' }}>
              No subjects yet
            </p>
          )}
          {subjects.map((sub) => {
            const active = pathname === `/subject/${sub.id}`
            return (
              <Link
                key={sub.id}
                href={`/subject/${sub.id}`}
                className={`nav-item${active ? ' active' : ''}`}
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{sub.icon}</span>
                  <span style={{
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:   'nowrap',
                  }}>
                    {sub.name}
                  </span>
                </span>
                <ChevronRight size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
              </Link>
            )
          })}
        </div>

        {/* Settings (Pushed to bottom) */}
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem', flexShrink: 0 }}>
          <Link href="/settings" className={`nav-item${pathname === '/settings' ? ' active' : ''}`}>
            <Settings size={15} /> Settings
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding:    '0.875rem 1rem',
          borderTop:  '1px solid rgba(255,255,255,0.07)',
          fontSize:   '0.7rem',
          color:      'rgba(255,255,255,0.2)',
          textAlign:  'center',
          flexShrink: 0,
        }}
      >
        Akira · AI Study Companion
      </div>
    </aside>
  )
}
