'use client'

import { useEffect, useState } from 'react'
import { deleteDocument, getDocuments } from '@/lib/api'
import { FileText, Loader2, Trash2 } from 'lucide-react'

// This defines the shape of the data coming from your FastAPI backend
interface DBDocument {
  id: number;
  filename: string;
  chunk_count: number;
  file_type: string;
}

interface Props {
  subjectId: number | null;
}

export function FileList({ subjectId }: Props) {
  const [files, setFiles] = useState<DBDocument[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Fetch the files from SQLite whenever you click a new Subject
  useEffect(() => {
    if (!subjectId) {
      setFiles([])
      return
    }

    const fetchFiles = async () => {
      setIsLoading(true)
      try {
        const data = await getDocuments(subjectId)
        setFiles(data)
      } catch (error) {
        console.error("Failed to fetch files", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [subjectId])

  const handleDelete = async (documentId: number) => {
    setDeletingId(documentId)
    try {
      await deleteDocument(documentId)
      setFiles((current) => current.filter((file) => file.id !== documentId))
    } catch (error) {
      console.error('Failed to delete file', error)
    } finally {
      setDeletingId(null)
    }
  }

  // 1. Safe state: No subject selected yet
  if (!subjectId) {
    return null; 
  }

  // 2. Safe state: Loading from database
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)' }}>
        <Loader2 size={16} className="animate-spin" />
        <span style={{ fontSize: '0.85rem' }}>Loading Akira's memory...</span>
      </div>
    )
  }

  // 3. Safe state: Empty database for this subject
  if (files && files.length === 0) {
    return <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>No notes uploaded for this subject yet.</p>
  }

  // 4. Success state: Render Claude's UI with actual DB data
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {files.map((f) => (
        <div
          key={f.id}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            transition: 'background-color 0.2s ease',
          }}
        >
          <FileText size={18} color="#a685ff" />
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '0.1rem',
              }}
            >
              {f.filename}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(16,185,129,0.8)' }}>
              {f.chunk_count} chunks embedded in ChromaDB
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              void handleDelete(f.id)
            }}
            disabled={deletingId === f.id}
            title="Delete file"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: deletingId === f.id ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
              color: deletingId === f.id ? 'rgba(248,113,113,0.9)' : 'rgba(255,255,255,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: deletingId === f.id ? 'wait' : 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {deletingId === f.id ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
