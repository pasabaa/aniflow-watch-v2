'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProgressMap, HistoryMap } from '@/lib/upstream/types';

interface ProgressState {
  progress: ProgressMap;
  history: HistoryMap;
  recordEpisodeAccess: (
    slug: string,
    data: {
      episodeNumber: number;
      title: string;
      poster?: string;
      mediaId?: number;
      thumbnailUrl?: string;
    }
  ) => void;
  updateProgress: (
    slug: string,
    data: {
      episodeNumber: number;
      position: number;
      duration: number;
      title: string;
      poster?: string;
      mediaId?: number;
      thumbnailUrl?: string;
    }
  ) => void;
  markWatched: (slug: string, episodeNumber: number) => void;
  clearProgress: (slug: string) => void;
  clearHistory: (slug?: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      history: {},

      recordEpisodeAccess: (slug, { episodeNumber, title, poster, mediaId, thumbnailUrl }) => {
        const now = Date.now();
        set((state) => {
          // 1. Immediately record in history
          const currentHistory = state.history[slug] || [];
          const updatedHistory = currentHistory.includes(episodeNumber)
            ? currentHistory
            : [...currentHistory, episodeNumber];

          // 2. Initialize or preserve existing progress
          const existing = state.progress[slug];
          const isSameEpisode = existing?.episodeNumber === episodeNumber;

          return {
            history: {
              ...state.history,
              [slug]: updatedHistory,
            },
            progress: {
              ...state.progress,
              [slug]: {
                episodeNumber,
                position: isSameEpisode ? (existing?.position || 0) : 0,
                duration: isSameEpisode ? (existing?.duration || 0) : 0,
                title: title || existing?.title || slug,
                poster: poster || existing?.poster,
                mediaId: mediaId || existing?.mediaId,
                thumbnailUrl: thumbnailUrl || existing?.thumbnailUrl,
                updatedAt: now,
              },
            },
          };
        });
      },

      updateProgress: (
        slug,
        { episodeNumber, position, duration, title, poster, mediaId, thumbnailUrl }
      ) => {
        const now = Date.now();
        const validDuration = duration > 0 ? duration : 0;
        const isCompleted = validDuration > 0 && position >= validDuration * 0.9;

        set((state) => {
          // Always ensure episode is present in history
          const currentHistory = state.history[slug] || [];
          let updatedHistory = currentHistory;
          if (!currentHistory.includes(episodeNumber)) {
            updatedHistory = [...currentHistory, episodeNumber];
          }

          // If reached 90%, auto-advance to next episode with position 0
          const nextEpisodeNumber = isCompleted ? episodeNumber + 1 : episodeNumber;
          const nextPosition = isCompleted ? 0 : position;
          const existing = state.progress[slug];

          return {
            history: {
              ...state.history,
              [slug]: updatedHistory,
            },
            progress: {
              ...state.progress,
              [slug]: {
                episodeNumber: nextEpisodeNumber,
                position: nextPosition,
                duration: validDuration || existing?.duration || 0,
                title: title || existing?.title || slug,
                poster: poster || existing?.poster,
                mediaId: mediaId || existing?.mediaId,
                thumbnailUrl: thumbnailUrl || existing?.thumbnailUrl,
                updatedAt: now,
              },
            },
          };
        });
      },

      markWatched: (slug, episodeNumber) => {
        set((state) => {
          const current = state.history[slug] || [];
          if (current.includes(episodeNumber)) return state;
          return {
            history: {
              ...state.history,
              [slug]: [...current, episodeNumber],
            },
          };
        });
      },

      clearProgress: (slug) => {
        set((state) => {
          const next = { ...state.progress };
          delete next[slug];
          return { progress: next };
        });
      },

      clearHistory: (slug) => {
        set((state) => {
          if (slug) {
            const next = { ...state.history };
            delete next[slug];
            return { history: next };
          }
          return { history: {} };
        });
      },
    }),
    {
      name: 'flow_progress_v1',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
