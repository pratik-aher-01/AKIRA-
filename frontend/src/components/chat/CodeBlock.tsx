// Component stub ready for Claude
'use client'

import { useState, useCallback } from 'react'
import { Copy, Check, Play, Loader2, Terminal } from 'lucide-react'
import { usePyodide } from '@/hooks/usePyodide'
import { getLangLabel, isRunnable } from '@/lib/markdown'

interface Props {
  code: string
  lang?: string
}

export function CodeBlock({ code, lang }: Props) {
  const [copied,      setCopied]      = useState(false)
  const [output,      setOutput]      = useState<string | null>(null)
  const [outputError, setOutputError] = useState(false)
  const [running,     setRunning]     = useState(false)

  const { runCode, isLoading: pyLoading } = usePyodide()

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const run = useCallback(async () => {
    if (running || pyLoading) return
    setRunning(true)
    setOutput(null)
    setOutputError(false)

    if (lang === 'python') {
      const res = await runCode(code)
      if (res.error) {
        setOutput(res.error)
        setOutputError(true)
      } else {
        setOutput(res.output || '(no output)')
        setOutputError(false)
      }
    } else if (lang === 'javascript' || lang === 'js') {
      try {
        const logs: string[] = []
        const fakeConsole = { log: (...a: unknown[]) => logs.push(a.map(String).join(' ')) }
        // eslint-disable-next-line no-new-func
        const fn = new Function('console', code)
        fn(fakeConsole)
        setOutput(logs.join('\n') || '(no output)')
        setOutputError(false)
      } catch (e) {
        setOutput(e instanceof Error ? e.message : String(e))
        setOutputError(true)
      }
    }

    setRunning(false)
  }, [code, lang, runCode, running, pyLoading])

  const canRun = isRunnable(lang)
  const label  = getLangLabel(lang)

  return (
    <div className="code-block-wrapper">
      {/* Header */}
      <div className="code-block-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Terminal size={12} />
          <span style={{ fontWeight: 600, color: 'rgba(166,133,255,0.9)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {canRun && (
            <button
              onClick={run}
              disabled={running || pyLoading}
              title="Run code"
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '0.3rem',
                padding:    '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize:   '0.7rem',
                fontWeight: 600,
                color:      running || pyLoading ? 'rgba(255,255,255,0.3)' : '#10b981',
                background: 'rgba(16,185,129,0.1)',
                border:     '1px solid rgba(16,185,129,0.25)',
                cursor:     running || pyLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {running || pyLoading
                ? <><Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> {pyLoading ? 'Loading…' : 'Running…'}</>
                : <><Play size={11} /> Run</>
              }
            </button>
          )}
          <button
            onClick={copy}
            title="Copy code"
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '0.3rem',
              padding:    '0.2rem 0.5rem',
              borderRadius: '6px',
              fontSize:   '0.7rem',
              color:      copied ? '#10b981' : 'rgba(255,255,255,0.4)',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              transition: 'color 0.15s ease',
            }}
          >
            {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="code-block-body">
        <pre style={{ margin: 0 }}>
          <code
            className={lang ? `language-${lang}` : ''}
            style={{
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
              fontSize:   '0.84rem',
              lineHeight: 1.65,
              color:      '#e2e8f0',
            }}
          >
            {code}
          </code>
        </pre>
      </div>

      {/* Output */}
      {output !== null && (
        <div className={`code-output${outputError ? ' error' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', fontSize: '0.68rem', opacity: 0.6, fontWeight: 600 }}>
            <Terminal size={10} />
            OUTPUT
          </div>
          {output}
        </div>
      )}
    </div>
  )
}