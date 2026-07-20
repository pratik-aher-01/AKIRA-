import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  useCustomKey: boolean
  apiKey: string
  temperature: number
  setUseCustomKey: (value: boolean) => void
  setApiKey: (value: string) => void
  setTemperature: (value: number) => void
  clearAllLocalData: () => void
}

const defaults = {
  useCustomKey: false,
  apiKey: '',
  temperature: 0.7,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      setUseCustomKey: (value) => set({ useCustomKey: value }),
      setApiKey: (value) => set({ apiKey: value }),
      setTemperature: (value) => set({ temperature: value }),
      clearAllLocalData: () => {
        set(defaults)

        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('akira-settings-storage')
          window.location.href = '/'
        }
      },
    }),
    {
      name: 'akira-settings-storage',
    }
  )
)
