// Component stub ready for Claude
'use client'

import { useEffect } from 'react'
import { useSubjectStore } from '@/store/subjectStore'
import { useChatStore } from '@/store/chatStore'
import { useSubjects } from '@/hooks/useSubjects'
import { useChat } from '@/hooks/useChat'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ChatInput } from '@/components/chat/ChatInput'
import { TopBar } from '@/components/layout/TopBar'
import { Loader2 } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default function SubjectChatPage({ params }: Props) {
  const subjectId = Number(params.id)

  const { isLoaded } = useSubjects()
  const subject = useSubjectStore((s) => s.getById(subjectId))
  const clearMessages = useChatStore((s) => s.clearMessages)

  const { messages, isLoading, ask, loadHistory } = useChat(subjectId)

  // Load chat history on mount
  useEffect(() => {
    if (isLoaded && subject) loadHistory()
  }, [isLoaded, subject, loadHistory])

  // Loading state
  if (!isLoaded) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} color="rgba(166,133,255,0.6)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  // Subject not found
  if (!subject) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem' }}>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-syne)' }}>Subject not found</p>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>It may have been deleted.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar subject={subject} onClearChat={() => clearMessages(subjectId)} />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput
        onSend={ask}
        isLoading={isLoading}
        placeholder={`Ask Akira about ${subject.name}…`}
      />
    </div>
  )
}
