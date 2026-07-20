// Component stub ready for Claude
'use client'

import { useEffect, useCallback } from 'react'
import { useSubjectStore } from '@/store/subjectStore'
import { getSubjects, createSubject, deleteSubject, getDocuments } from '@/lib/api'
import type { CreateSubjectPayload, Subject } from '@/lib/types'

export function useSubjects() {
  const { subjects, isLoaded, setSubjects, addSubject, removeSubject } = useSubjectStore()

  const load = useCallback(async () => {
    try {
      const data = await getSubjects()
      const subjectsWithCounts = await Promise.all(
        data.map(async (subject): Promise<Subject> => {
          try {
            const documents = await getDocuments(subject.id)
            return { ...subject, document_count: documents.length }
          } catch (error) {
            console.error(`Failed to load documents for subject ${subject.id}:`, error)
            return { ...subject, document_count: 0 }
          }
        })
      )
      setSubjects(subjectsWithCounts)
    } catch (err) {
      console.error('Failed to load subjects:', err)
    }
  }, [setSubjects])

  useEffect(() => {
    if (!isLoaded) load()
  }, [isLoaded, load])

  const create = useCallback(
    async (payload: CreateSubjectPayload) => {
      const subject = await createSubject(payload)
      addSubject(subject)
      return subject
    },
    [addSubject]
  )

  const remove = useCallback(
    async (id: number) => {
      await deleteSubject(id)
      removeSubject(id)
    },
    [removeSubject]
  )

  return { subjects, isLoaded, load, create, remove }
}
