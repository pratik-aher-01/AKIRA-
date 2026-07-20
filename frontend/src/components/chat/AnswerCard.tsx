'use client'

import ReactMarkdown from 'react-markdown'
import { CodeBlock } from './CodeBlock'
import { DiagramBlock } from './DiagramBlock'
import { remarkPlugins, rehypePlugins, baseComponents } from '@/lib/markdown'
import type { Components } from 'react-markdown'

interface Props {
  content: string
}

export function AnswerCard({ content }: Props) {
  const components: Components = {
    ...baseComponents,

    /* ── Headings ── */
    h1: ({ children }) => (
      <h1 className="text-xl md:text-2xl font-bold text-white/95 font-syne mb-3 mt-5 tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg md:text-xl font-bold text-white/90 font-syne mb-2.5 mt-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-white/80 font-syne mb-2 mt-3">
        {children}
      </h3>
    ),

    /* ── Paragraph ── */
    p: ({ children }) => (
      <p className="text-[15px] leading-relaxed text-white/80 mb-4 font-inter">
        {children}
      </p>
    ),

    /* ── Lists ── */
    ul: ({ children }) => (
      <ul className="pl-5 mb-4 flex flex-col gap-1.5 list-disc list-outside text-white/70">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="pl-5 mb-4 flex flex-col gap-1.5 list-decimal list-outside text-white/70">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-[15px] leading-relaxed font-inter">
        {children}
      </li>
    ),

    /* ── Blockquote ── */
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-violet-500/60 pl-4 my-4 text-white/50 italic text-[15px] leading-relaxed">
        {children}
      </blockquote>
    ),

    /* ── Bold / emphasis ── */
    strong: ({ children }) => (
      <strong className="font-bold text-white/95">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="text-white/60 italic">{children}</em>
    ),

    /* ── Horizontal rule ── */
    hr: () => (
      <hr className="border-0 border-t border-white/10 my-6" />
    ),

    /* ── Code Blocks & Inline Code ── */
    code({ node, className, children, ...props }: any) {
      const isInline = !className && !String(children).includes('\n')
      
      // BUG FIX: Strict Regex to grab ONLY the language name, ignoring 'hljs' or other random classes
      const match = /language-(\w+)/.exec(className || '')
      const lang = match ? match[1].toLowerCase() : ''
      const codeStr = String(children).replace(/\n$/, '')

      if (isInline) {
        return (
          <code
            className="bg-violet-500/10 text-violet-300 px-1.5 py-0.5 rounded-md text-[0.85em] border border-violet-500/20 font-mono"
            {...props}
          >
            {children}
          </code>
        )
      }

      // Now this will perfectly trigger because lang is strictly "mermaid"
      if (lang === 'mermaid') {
        return <DiagramBlock code={codeStr} />
      }

      // Standard code blocks
      return <CodeBlock code={codeStr} lang={lang || 'text'} />
    },

    pre({ children }) {
      return <>{children}</>
    },
  }

  return (
    <div className="w-full">
      <ReactMarkdown
        remarkPlugins={remarkPlugins as never}
        rehypePlugins={rehypePlugins as never}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}