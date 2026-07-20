'use client'

import { useSubjects } from '@/hooks/useSubjects'
import { SubjectCard } from '@/components/layout/SubjectCard'
import { Sparkles, Upload, Plus, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { subjects, isLoaded, remove } = useSubjects()
  const router = useRouter()

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10 overflow-y-auto hide-scrollbar relative bg-black">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-10 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Sparkles size={24} className="text-violet-400" />
            <h1 className="text-xl md:text-2xl font-bold font-syne text-white/95 tracking-tight">
              Your Subjects
            </h1>
          </div>
        </div>

        {/* Quick Action - Only shows if subjects exist and is loaded */}
        {isLoaded && subjects.length > 0 && (
          <button
            onClick={() => router.push('/upload')}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white/80 hover:text-white transition-all shadow-lg active:scale-95"
          >
            <Upload size={16} className="text-blue-400 group-hover:-translate-y-0.5 transition-transform" />
            Upload Notes
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="shimmer"
              style={{
                height:         '160px',
                borderRadius:   '16px',
                border:         '1px solid rgba(255,255,255,0.06)',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State (Interactive Dashed Dropzone style) */}
      {isLoaded && subjects.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 md:p-16 mt-4 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all duration-300">
            <BookOpen size={32} className="text-violet-400" />
          </div>
          
          <h3 className="text-xl font-bold text-white/90 font-syne mb-2">
            Your vault is empty
          </h3>
          <p className="text-sm text-white/40 text-center max-w-sm mb-8">
            Create your first subject in the sidebar, then upload your PDFs, PPTs, or images to let Akira process them.
          </p>
          
          <button
            onClick={() => router.push('/upload')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all active:scale-95"
          >
            <Plus size={18} />
            Add First Notes
          </button>
        </div>
      )}

      {/* Subject Grid */}
      {isLoaded && subjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 pb-10">
          {subjects.map((sub) => (
            <SubjectCard key={sub.id} subject={sub} onDelete={remove} />
          ))}
        </div>
      )}

    </div>
  )
}
