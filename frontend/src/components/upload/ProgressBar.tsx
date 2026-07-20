// Component stub ready for Claude
'use client'

import type { UploadStatus } from '@/lib/types'

interface Props {
  progress: number     // 0-100
  status: UploadStatus
}

const STATUS_COLORS: Record<UploadStatus, string> = {
  idle:       'rgba(255,255,255,0.2)',
  uploading:  '#7c3aed',
  processing: '#3b82f6',
  done:       '#10b981',
  error:      '#ef4444',
}

const STATUS_LABELS: Record<UploadStatus, string> = {
  idle:       'Waiting',
  uploading:  'Uploading…',
  processing: 'Processing…',
  done:       'Done',
  error:      'Failed',
}

export function ProgressBar({ progress, status }: Props) {
  const color = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   '0.3rem',
          fontSize:       '0.72rem',
          color:          'rgba(255,255,255,0.45)',
        }}
      >
        <span>{label}</span>
        {status !== 'idle' && status !== 'error' && (
          <span style={{ color }}>{progress}%</span>
        )}
      </div>
      <div
        style={{
          height:       '4px',
          borderRadius: '999px',
          background:   'rgba(255,255,255,0.08)',
          overflow:     'hidden',
        }}
      >
        <div
          style={{
            height:           '100%',
            width:            `${progress}%`,
            borderRadius:     '999px',
            background:       color,
            transition:       'width 0.3s ease, background 0.3s ease',
            boxShadow:        status !== 'idle' && status !== 'error' ? `0 0 8px ${color}` : 'none',
          }}
        />
      </div>
    </div>
  )
}