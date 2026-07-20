'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'

// 1. FIXED: Changed 'onFiles' to 'onFileDrop' to match the UploadPage exactly
interface Props {
  onFileDrop: (file: File) => void
  disabled?: boolean
}

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt', '.md'], // Added txt/md support for your code files!
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'image/webp': ['.webp'],
}

export function DropZone({ onFileDrop, disabled = false }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      // 2. FIXED: Grab the first file and send it to onFileDrop
      if (accepted.length > 0 && onFileDrop) {
        onFileDrop(accepted[0])
      }
    },
    [onFileDrop]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    disabled,
    maxSize: 50 * 1024 * 1024, // 50 MB
  })

  return (
    <div
      {...getRootProps()}
      className={isDragActive ? 'drop-zone drag-over' : 'drop-zone'}
      style={{
        padding:        '3rem 2rem',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '1rem',
        textAlign:      'center',
        cursor:         disabled ? 'not-allowed' : 'pointer',
        opacity:        disabled ? 0.5 : 1,
        transition:     'all 0.2s ease',
        border:         isDragActive ? '2px dashed #a685ff' : '2px dashed rgba(255,255,255,0.2)',
        borderRadius:   '16px',
        backgroundColor: isDragActive ? 'rgba(124,58,237,0.1)' : 'transparent'
      }}
    >
      <input {...getInputProps()} />

      {/* Icon */}
      <div
        style={{
          width:          '56px',
          height:         '56px',
          borderRadius:   '16px',
          background:     isDragActive
            ? 'rgba(124,58,237,0.25)'
            : 'rgba(255,255,255,0.06)',
          border:         isDragActive
            ? '1px solid rgba(124,58,237,0.5)'
            : '1px solid rgba(255,255,255,0.1)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          transition:     'all 0.2s ease',
        }}
      >
        {isDragActive
          ? <Upload size={24} color="#a685ff" />
          : <FileText size={24} color="rgba(255,255,255,0.35)" />
        }
      </div>

      {/* Text */}
      <div>
        {isDragReject ? (
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f87171' }}>
            File type not supported
          </p>
        ) : isDragActive ? (
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#a685ff' }}>
            Drop to add files
          </p>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '0.3rem' }}>
              Drag & drop your notes here
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
              or click to browse
            </p>
          </>
        )}
      </div>

      {/* Supported formats */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['PDF', 'PPTX', 'TXT', 'JPG'].map((fmt) => (
          <span
            key={fmt}
            style={{
              padding:      '0.2rem 0.6rem',
              borderRadius: '6px',
              background:   'rgba(255,255,255,0.05)',
              border:       '1px solid rgba(255,255,255,0.08)',
              fontSize:     '0.72rem',
              color:        'rgba(255,255,255,0.4)',
              fontWeight:   600,
            }}
          >
            {fmt}
          </span>
        ))}
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', alignSelf: 'center' }}>
          · max 50 MB
        </span>
      </div>
    </div>
  )
}
