'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Adjust this import if your types are located elsewhere
import type { Subject } from '@/lib/types'

interface Props {
  subjects: Subject[]
  selectedId: number | null
  onChange: (id: number) => void
}

export function SubjectSelector({ subjects, selectedId, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedSubject = subjects.find(s => s.id === selectedId)

  // Click-outside listener to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative w-full">
      
      {/* 1. The Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-[#0a0c10] hover:bg-[#161b22] rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/30 border ${
          isOpen ? 'border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-white/[0.08]'
        }`}
      >
        {selectedSubject ? (
          <div className="flex items-center gap-3">
            <span className="text-base flex-shrink-0">{selectedSubject.icon}</span>
            <span className="font-medium text-white/90 truncate">{selectedSubject.name}</span>
          </div>
        ) : (
          <span className="text-white/40 font-medium">Select a subject...</span>
        )}
        <ChevronDown
          size={16}
          className={`text-white/40 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 2. The Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-1.5 bg-[#0a0c10] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="max-h-[220px] overflow-y-auto hide-scrollbar">
            {subjects.length === 0 ? (
              <div className="px-4 py-3 text-sm text-white/30 text-center font-medium">
                No subjects available
              </div>
            ) : (
              subjects.map((sub) => {
                const isSelected = selectedId === sub.id
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      onChange(sub.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? 'bg-violet-500/10 text-white border-l-2 border-violet-500'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base flex-shrink-0">{sub.icon}</span>
                      <span className="font-medium truncate">{sub.name}</span>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-violet-400 flex-shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
      
    </div>
  )
}
