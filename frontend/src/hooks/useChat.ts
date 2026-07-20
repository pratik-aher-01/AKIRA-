// Component stub ready for Claude
'use client'

import { useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useSettingsStore } from '@/store/settingsStore'
import { sendMessage, getChatHistory } from '@/lib/api'

export function useChat(subjectId: number) {
  const {
    getMessages,
    addUserMessage,
    addAssistantMessage,
    setLoading,
    isLoading,
    hydrateMessages,
  } = useChatStore()

  const messages = getMessages(subjectId)

  const loadHistory = useCallback(async () => {
    try {
      const history = await getChatHistory(subjectId)
      hydrateMessages(subjectId, history)
    } catch {
      // History load failure is non-critical
    }
  }, [subjectId, hydrateMessages])

  const ask = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return

      addUserMessage(subjectId, question.trim())
      setLoading(true)

      try {
        const { useCustomKey, apiKey, temperature } = useSettingsStore.getState()
        const res = await sendMessage({
          question: question.trim(),
          subject_id: subjectId,
          temperature,
          api_key: useCustomKey && apiKey ? apiKey : undefined,
        })
        addAssistantMessage(subjectId, res.answer, res.source, res.chunks_used)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        addAssistantMessage(
          subjectId,
          `Sorry, I couldn't get an answer. **Error:** ${msg}`,
          undefined,
        )
      } finally {
        setLoading(false)
      }
    },
    [subjectId, isLoading, addUserMessage, addAssistantMessage, setLoading]
  )

  return { messages, isLoading, ask, loadHistory }
}
