// Component stub ready for Claude
'use client'

import { useRef, useCallback, useState } from 'react'

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>
  loadPackagesFromImports: (code: string) => Promise<void>
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInstance>
    _pyodideInstance?: PyodideInstance
  }
}

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const instanceRef = useRef<PyodideInstance | null>(null)

  const load = useCallback(async (): Promise<PyodideInstance> => {
    // Return cached instance
    if (instanceRef.current) return instanceRef.current

    setIsLoading(true)

    // Inject Pyodide script if not already present
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Pyodide'))
        document.head.appendChild(script)
      })
    }

    const pyodide = await window.loadPyodide!({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    })

    instanceRef.current = pyodide
    setIsReady(true)
    setIsLoading(false)
    return pyodide
  }, [])

  const runCode = useCallback(
    async (code: string): Promise<{ output: string; error: string | null }> => {
      try {
        const py = await load()
        await py.loadPackagesFromImports(code)

        // Capture stdout
        const wrapCode = `
import sys
import io
_stdout = io.StringIO()
sys.stdout = _stdout
try:
${code
  .split('\n')
  .map((l) => '    ' + l)
  .join('\n')}
except Exception as _e:
    print(f"Error: {_e}")
finally:
    sys.stdout = sys.__stdout__
_stdout.getvalue()
`
        const result = await py.runPythonAsync(wrapCode)
        return { output: String(result ?? ''), error: null }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return { output: '', error: msg }
      }
    },
    [load]
  )

  return { runCode, isLoading, isReady, load }
}