'use client'

import { useEffect, useRef, useState, useId } from 'react'
import { GitBranch, AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface Props {
  code: string
}

export function DiagramBlock({ code }: Props) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function render() {
      setLoading(true)
      setError(null)
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            fontFamily: 'var(--font-inter), sans-serif',
            primaryColor: 'rgba(124, 58, 237, 0.15)',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#a685ff',
            lineColor: '#a685ff',
            secondaryColor: 'rgba(59, 130, 246, 0.1)',
            tertiaryColor: '#11151c',
            background: 'transparent',
            nodeBorder: '#7c3aed',
            titleColor: '#ffffff',
          },
        })

        // 1. VALIDATE FIRST: This prevents Mermaid from injecting the "Bomb" SVGs
        const isValid = await mermaid.parse(code.trim(), { suppressErrors: true }).catch(() => false);
        
        if (!isValid) {
          throw new Error("Akira generated invalid diagram syntax.");
        }

        // 2. RENDER: Only runs if the code is safe
        const { svg } = await mermaid.render(`mermaid-${id}`, code.trim())
        
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
          const svgEl = ref.current.querySelector('svg')
          if (svgEl) {
            svgEl.style.maxWidth = '100%'
            svgEl.style.height = 'auto'
            svgEl.removeAttribute('width')
          }
        }
      } catch (err) {
        if (!cancelled) {
          // Clean up any stray error SVGs Mermaid might have injected globally
          const strayBomb = document.getElementById(`mermaid-${id}`);
          if (strayBomb) strayBomb.remove();

          setError(err instanceof Error ? err.message : 'Diagram render failed')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    render()
    return () => { cancelled = true }
  }, [code, id])

  return (
    <div className="my-5 rounded-2xl border border-white/10 bg-[#0a0c10] overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-violet-500/10 border-b border-violet-500/20">
        <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-widest">
          <GitBranch size={14} />
          <span>Architecture Diagram</span>
        </div>
        <button
          onClick={() => setShowRaw((v) => !v)}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-white/40 hover:text-white/90 transition-colors"
        >
          {showRaw ? <><ChevronUp size={12} /> Hide Source</> : <><ChevronDown size={12} /> View Source</>}
        </button>
      </div>

      {/* Render Area */}
      <div className="p-4 md:p-6 flex justify-center overflow-x-auto relative min-h-[120px]">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-white/40 text-sm font-medium">
            <Loader2 size={16} className="animate-spin text-violet-400" />
            Drawing...
          </div>
        )}

        {error ? (
          <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs w-full">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm">Failed to draw diagram</span>
              <span className="opacity-80">Akira made a syntax error. Click "View Source" to see the raw output, or ask Akira to try again.</span>
            </div>
          </div>
        ) : (
          <div
            ref={ref}
            className={`mermaid-wrapper transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
      </div>

      {/* Raw Source Toggle */}
      {showRaw && (
        <div className="p-4 border-t border-white/5 bg-black/40 overflow-x-auto">
          <pre className="text-[11px] text-white/50 font-mono leading-relaxed">{code}</pre>
        </div>
      )}
    </div>
  )
}