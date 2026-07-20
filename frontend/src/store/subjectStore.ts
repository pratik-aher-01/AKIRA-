// Component stub ready for Claude
import { create } from 'zustand'
import type { Subject } from '@/lib/types'

interface SubjectStore {
  subjects: Subject[]
  activeSubject: Subject | null
  isLoaded: boolean

  setSubjects: (subjects: Subject[]) => void
  setActiveSubject: (subject: Subject | null) => void
  addSubject: (subject: Subject) => void
  removeSubject: (id: number) => void
  updateSubject: (id: number, patch: Partial<Subject>) => void
  getById: (id: number) => Subject | undefined
}

export const useSubjectStore = create<SubjectStore>((set, get) => ({
  subjects: [],
  activeSubject: null,
  isLoaded: false,

  setSubjects: (subjects) => set({ subjects, isLoaded: true }),

  setActiveSubject: (subject) => set({ activeSubject: subject }),

  addSubject: (subject) =>
    set((s) => ({ subjects: [...s.subjects, subject] })),

  removeSubject: (id) =>
    set((s) => ({
      subjects: s.subjects.filter((sub) => sub.id !== id),
      activeSubject: s.activeSubject?.id === id ? null : s.activeSubject,
    })),

  updateSubject: (id, patch) =>
    set((s) => ({
      subjects: s.subjects.map((sub) =>
        sub.id === id ? { ...sub, ...patch } : sub
      ),
      activeSubject:
        s.activeSubject?.id === id
          ? { ...s.activeSubject, ...patch }
          : s.activeSubject,
    })),

  getById: (id) => get().subjects.find((s) => s.id === id),
}))