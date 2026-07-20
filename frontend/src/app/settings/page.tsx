'use client'

import { useState } from 'react'
import Link from 'next/link'
import GradientText from '@/components/ui/GradientText'
import { useSettingsStore } from '@/store/settingsStore'
import {
  ArrowLeft,
  Key,
  Sliders,
  Info,
  Database,
  Shield,
  ExternalLink,
  ChevronDown,
  Settings2,
} from 'lucide-react'

export default function SettingsPage() {
  const [showKeyInfo, setShowKeyInfo] = useState(false)
  const {
    useCustomKey,
    setUseCustomKey,
    apiKey,
    setApiKey,
    temperature,
    setTemperature,
    clearAllLocalData,
  } = useSettingsStore()

  return (
    <div
      className="h-screen w-screen bg-black flex flex-col overflow-hidden"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <header className="relative flex items-center justify-between px-4 h-16 flex-shrink-0 z-30 bg-gradient-to-b from-[#0a0a0a] to-transparent border-b border-white/[0.07]">
        <div className="flex items-center z-10">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95"
          >
            <ArrowLeft size={16} className="text-zinc-400" />
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <GradientText
            className="font-syne font-bold text-lg tracking-tight"
            colors={['#a685ff', '#60a5fa', '#f9a8d4']}
            animationSpeed={6}
          >
            Settings
          </GradientText>
        </div>

        <div className="flex items-center gap-2 z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Akira ready</span>
        </div>
      </header>

      <main
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.no-sb::-webkit-scrollbar{display:none}`}</style>

        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Key size={12} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">1 · AI Provider</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white/90 mb-1">Use Custom API Key</h3>
                <p className="text-[13px] text-white/40">Bypass limits by using your own Gemini/OpenAI key.</p>
              </div>
              <button
                onClick={() => setUseCustomKey(!useCustomKey)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${useCustomKey ? 'bg-violet-600' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300 ${useCustomKey ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${useCustomKey ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Your Gemini Key"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                />

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowKeyInfo(!showKeyInfo)}
                    className="w-full flex items-center justify-between p-3 text-[13px] text-blue-300 font-medium hover:bg-blue-500/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Info size={14} /> How to get an API key?
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${showKeyInfo ? 'rotate-180' : ''}`} />
                  </button>
                  {showKeyInfo && (
                    <div className="px-3 pb-3 pt-1 text-[12px] text-blue-200/70 leading-relaxed">
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Go to the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>.</li>
                        <li>Sign in with your Google account.</li>
                        <li>Click "Create API Key" and copy the generated string.</li>
                        <li>Paste it here. Your key is stored locally and never sent to our servers.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Sliders size={12} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">2 · Model Tuning</span>
          </div>
          <div className="p-4 flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white/90">Temperature</h3>
                <span className="text-[11px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md">
                  {temperature.toFixed(2)}
                </span>
              </div>
              <p className="text-[13px] text-white/40 mb-4">Higher values make Akira more creative. Lower values make it more focused and deterministic.</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between text-[10px] text-white/30 mt-2 font-medium uppercase tracking-wider">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <div className="w-6 h-6 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <Database size={12} className="text-zinc-400" />
            </div>
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">3 · Data & Privacy</span>
          </div>
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white/90 mb-1">Clear Local Data</h3>
              <p className="text-[13px] text-white/40">Permanently delete all subjects, notes, and chat history from this device.</p>
            </div>
            <button
              onClick={clearAllLocalData}
              className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0"
            >
              Wipe Data
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <div className="w-6 h-6 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <Settings2 size={12} className="text-zinc-400" />
            </div>
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">4 · About</span>
          </div>
          <div className="p-4 flex justify-center">
            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] mb-3 border border-white/10">
                <Shield size={18} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-white/90 font-syne tracking-tight">Akira Engine</h3>
              <p className="text-xs text-white/30 mt-1 mb-3">Version 1.0.0-beta</p>
              <a href="#" className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                View Documentation <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="h-2 shrink-0" />
      </main>

      <footer className="shrink-0 border-t border-white/[0.06] px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-zinc-700">4 sections available</span>
        <span className="text-[10px] text-zinc-700">Core controls ready</span>
      </footer>
    </div>
  )
}
