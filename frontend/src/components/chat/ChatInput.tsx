'use client'

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface Props {
  onSend: (message: string) => void
  isLoading: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  isLoading,
  placeholder = 'Ask Akira anything…',
}: Props) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false) // Drawer state
  const [charCount, setCharCount] = useState(0)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    setCharCount(0)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setIsExpanded(false)
    setFocused(false)
  }, [value, isLoading, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submit()
      }
    },
    [submit]
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    setCharCount(e.target.value.length)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [])

  const canSend = value.trim().length > 0 && !isLoading

  // Click-Outside Listener to gracefully collapse
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (value.trim() === '') {
          setIsExpanded(false)
          setFocused(false)
          if (textareaRef.current) textareaRef.current.style.height = 'auto'
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [value])

  // Auto-focus when expanding
  useEffect(() => {
    if (isExpanded && textareaRef.current && !focused) {
      textareaRef.current.focus()
    }
  }, [isExpanded, focused])

  return (
    <>
      <style>{`
        @keyframes glow-border {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes send-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.88); }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(6px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up { animation: slideUpFade 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .send-btn:active { animation: send-pop 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .chat-ta::-webkit-scrollbar { display: none; }
        .chat-ta { scrollbar-width: none; }
        .chat-ta::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      <div
        className="w-full relative shrink-0 px-4 pb-4 pt-2 z-40"
        style={{ background: 'linear-gradient(to top, #0a0c10 80%, transparent)' }}
      >
        <div
          ref={containerRef}
          onClick={() => !isExpanded && setIsExpanded(true)}
          className={`mx-auto w-full max-w-4xl transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative ${
            isExpanded ? 'cursor-default' : 'cursor-text hover:scale-[1.01]'
          }`}
        >
          {/* ── Outer glow ring (visible when focused) ── */}
          <div
            className="absolute inset-x-0 inset-y-0 rounded-2xl transition-all duration-300 pointer-events-none z-0"
            style={{
              opacity: focused ? 1 : 0,
              boxShadow: '0 0 0 1.5px rgba(124,58,237,0.5), 0 0 28px rgba(124,58,237,0.18)',
              borderRadius: '18px',
            }}
          />

          {/* ── Main pill container ── */}
          <div
            className="relative flex flex-col rounded-[18px] border transition-all duration-300 z-10"
            style={{
              background: focused
                ? 'rgba(255,255,255,0.045)'
                : 'rgba(255,255,255,0.028)',
              borderColor: focused
                ? 'rgba(124,58,237,0.45)'
                : 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Top row: textarea */}
            <div className={`flex items-center gap-2 px-4 transition-all duration-300 ${isExpanded ? 'pt-3 pb-2' : 'py-3.5'}`}>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setFocused(true)
                  setIsExpanded(true)
                }}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                rows={1}
                disabled={isLoading}
                className="chat-ta flex-1 resize-none bg-transparent text-white/90 outline-none"
                style={{
                  maxHeight: '160px',
                  overflowY: 'auto',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.875rem',
                  lineHeight: '1.65',
                }}
              />
            </div>

            {/* Bottom toolbar (Only visible when expanded) */}
            {isExpanded && (
              <div className="flex items-center justify-between px-3 pb-2.5 animate-slide-up">
                {/* Left: auxiliary action icons / Char Counter */}
                <div className="flex items-center gap-1">
                  {charCount > 0 && (
                    <span
                      className="ml-2 text-[10px] tabular-nums transition-all duration-200"
                      style={{ color: charCount > 800 ? '#f87171' : 'rgba(255,255,255,0.2)' }}
                    >
                      {charCount}
                    </span>
                  )}
                </div>

                {/* Right: hint + send */}
                <div className="flex items-center gap-2">
                  {!isLoading && (
                    <span
                      className="select-none text-[10px] tracking-wider transition-opacity duration-200 hidden sm:block"
                      style={{
                        color: 'rgba(255,255,255,0.18)',
                        opacity: focused ? 1 : 0,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      ⏎ send · ⇧⏎ newline
                    </span>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); submit(); }}
                    disabled={!canSend}
                    className="send-btn relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200"
                    style={{
                      background: canSend
                        ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                        : 'rgba(255,255,255,0.05)',
                      border: canSend
                        ? '1px solid rgba(139,92,246,0.6)'
                        : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: canSend
                        ? '0 0 18px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'
                        : 'none',
                      cursor: canSend ? 'pointer' : 'not-allowed',
                      transform: canSend ? 'scale(1)' : 'scale(0.94)',
                    }}
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin text-white/60" />
                    ) : (
                      <Send
                        size={14}
                        style={{
                          color: canSend ? '#fff' : 'rgba(255,255,255,0.2)',
                          transform: canSend ? 'translateX(1px)' : 'none',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    )}

                    {/* Inner shimmer on active */}
                    {canSend && (
                      <div
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-40"
                        style={{
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                          backgroundSize: '200% auto',
                          animation: 'shimmer 2.5s linear infinite',
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}