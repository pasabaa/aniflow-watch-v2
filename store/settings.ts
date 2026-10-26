'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  audioPreference: 'SUB' | 'DUB';
  autoplayNext: boolean;
  setAudioPreference: (pref: 'SUB' | 'DUB') => void;
  setAutoplayNext: (enabled: boolean) => void;
  toggleAutoplayNext: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audioPreference: 'SUB',
      autoplayNext: true,
      setAudioPreference: (pref) => set({ audioPreference: pref }),
      setAutoplayNext: (enabled) => set({ autoplayNext: enabled }),
      toggleAutoplayNext: () => set((state) => ({ autoplayNext: !state.autoplayNext })),
    }),
    {
      name: 'flow_settings_v1',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
