// Component stub ready for Claude
import { create } from 'zustand'
import type { ChatMessage, SourceType } from '@/lib/types'
import { uid } from '@/lib/utils'

interface ChatStore {
  // State
  messagesBySubject: Record<number, ChatMessage[]>
  isLoading: boolean
  activeSubjectId: number | null

  // Actions
  setActiveSubject: (id: number) => void
  getMessages: (subjectId: number) => ChatMessage[]
  addUserMessage: (subjectId: number, content: string) => ChatMessage
  addAssistantMessage: (
    subjectId: number,
    content: string,
    source?: SourceType,
    chunksUsed?: number
  ) => ChatMessage
  setLoading: (loading: boolean) => void
  clearMessages: (subjectId: number) => void
  hydrateMessages: (subjectId: number, messages: ChatMessage[]) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messagesBySubject: {},
  isLoading: false,
  activeSubjectId: null,

  setActiveSubject: (id) => set({ activeSubjectId: id }),

  getMessages: (subjectId) => {
    return get().messagesBySubject[subjectId] ?? []
  },

  addUserMessage: (subjectId, content) => {
    const msg: ChatMessage = {
      id: uid(),
      subject_id: subjectId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    set((s) => ({
      messagesBySubject: {
        ...s.messagesBySubject,
        [subjectId]: [...(s.messagesBySubject[subjectId] ?? []), msg],
      },
    }))
    return msg
  },

  addAssistantMessage: (subjectId, content, source, chunksUsed) => {
    const msg: ChatMessage = {
      id: uid(),
      subject_id: subjectId,
      role: 'assistant',
      content,
      source,
      chunks_used: chunksUsed,
      created_at: new Date().toISOString(),
    }
    set((s) => ({
      messagesBySubject: {
        ...s.messagesBySubject,
        [subjectId]: [...(s.messagesBySubject[subjectId] ?? []), msg],
      },
    }))
    return msg
  },

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: (subjectId) =>
    set((s) => ({
      messagesBySubject: { ...s.messagesBySubject, [subjectId]: [] },
    })),

  hydrateMessages: (subjectId, messages) =>
    set((s) => ({
      messagesBySubject: { ...s.messagesBySubject, [subjectId]: messages },
    })),
}))