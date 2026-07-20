'use client'

import { useState } from 'react'
import { useSubjects } from '@/hooks/useSubjects'
import { useUpload } from '@/hooks/useUpload'
import { DropZone } from '@/components/upload/DropZone'
import { SubjectSelector } from '@/components/upload/SubjectSelector'
import { FileList } from '@/components/upload/FileList'
import { ProgressBar } from '@/components/upload/ProgressBar'
import GradientText from '@/components/ui/GradientText'
import { Loader2, ArrowLeft, BookOpen, Upload, FolderOpen } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const { subjects, isLoaded } = useSubjects()
  const { uploadFile, isUploading, progress, status } = useUpload()
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 size={24} className="text-violet-400 animate-spin" />
      </div>
    )
  }

  const handleFileDrop = async (file: File) => {
    if (!selectedSubjectId) return
    await uploadFile(file, selectedSubjectId)
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden" style={{ fontFamily: "'Syne', sans-serif" }}>

      {/* ── Header ── */}
        <header className="relative flex items-center justify-between px-4 h-16 flex-shrink-0 z-30 bg-gradient-to-b from-[#0a0a0a] to-transparent border-b border-white/[0.07]">
          
          {/* 1. Left: Back Arrow */}
          <div className="flex items-center z-10">
            <Link
              href="/"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95"
            >
              <ArrowLeft size={16} className="text-zinc-400" />
            </Link>
          </div>

          {/* 2. Center: Wordmark (Absolutely centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <GradientText
              className="font-syne font-bold text-lg tracking-tight"
              colors={['#a685ff', '#60a5fa', '#f9a8d4']}
              animationSpeed={6}
            >
              Knowledge Base
            </GradientText>
          </div>

          {/* 3. Right: Status Indicator (Balances the flex container) */}
          <div className="flex items-center gap-2 z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[11px] text-zinc-500 hidden sm:inline">Akira ready</span>
          </div>
          
        </header>

      {/* ── Scrollable stacked body ── */}
      <main
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.no-sb::-webkit-scrollbar{display:none}`}</style>

        {/* ── Box 1: Select Subject ── */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <BookOpen size={12} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">1 · Select Subject</span>
          </div>
          <div className="p-4">
            <SubjectSelector
              subjects={subjects}
              selectedId={selectedSubjectId}
              onChange={setSelectedSubjectId}
            />
            {subjects.length === 0 && (
              <p className="text-[11px] text-zinc-600 mt-2">No subjects yet. Create one from the home screen.</p>
            )}
          </div>
        </div>

        {/* ── Box 2: Upload ── */}
        <div
          className={`rounded-2xl border flex flex-col transition-all duration-200 ${
            selectedSubjectId
              ? 'border-white/[0.08] bg-zinc-950'
              : 'border-white/[0.04] bg-zinc-950/50 opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Upload size={12} className="text-violet-400" />
              </div>
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">2 · Upload Material</span>
            </div>
            {!selectedSubjectId && (
              <span className="text-[10px] text-amber-400/70 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                Select subject first
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col gap-3">
            <DropZone onFileDrop={handleFileDrop} disabled={isUploading || !selectedSubjectId} />
            {isUploading && <ProgressBar progress={progress} status={status} />}
          </div>
        </div>

        {/* ── Box 3: Current Files ── */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col" style={{ maxHeight: '40vh' }}>
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06] shrink-0">
            <div className="w-6 h-6 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <FolderOpen size={12} className="text-zinc-400" />
            </div>
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">3 · Current Files</span>
          </div>
          <div
            className="flex-1 min-h-0 overflow-y-auto p-4 no-sb"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {selectedSubjectId ? (
              <FileList subjectId={selectedSubjectId} />
            ) : (
              <div className="flex items-center justify-center h-16">
                <p className="text-[11px] text-zinc-700 text-center">Select a subject to see its files</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-2 shrink-0" />
      </main>

      {/* ── Footer ── */}
      <footer className="shrink-0 border-t border-white/[0.06] px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-zinc-700">{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</span>
        <span className="text-[10px] text-zinc-700">
          {selectedSubjectId ? `Subject #${selectedSubjectId} active` : 'No subject selected'}
        </span>
      </footer>
    </div>
  )
}
