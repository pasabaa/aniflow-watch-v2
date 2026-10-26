'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WatchlistMap } from '@/lib/upstream/types';

interface WatchlistState {
  items: WatchlistMap;
  addItem: (media: { slug: string; title: string; poster: string }) => void;
  removeItem: (slug: string) => void;
  toggleItem: (media: { slug: string; title: string; poster: string }) => void;
  isInWatchlist: (slug: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (media) =>
        set((state) => ({
          items: {
            ...state.items,
            [media.slug]: {
              title: media.title,
              poster: media.poster,
              addedAt: Date.now(),
            },
          },
        })),
      removeItem: (slug) =>
        set((state) => {
          const next = { ...state.items };
          delete next[slug];
          return { items: next };
        }),
      toggleItem: (media) => {
        const exists = !!get().items[media.slug];
        if (exists) {
          get().removeItem(media.slug);
        } else {
          get().addItem(media);
        }
      },
      isInWatchlist: (slug) => {
        return !!get().items[slug];
      },
    }),
    {
      name: 'flow_watchlist_v1',
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
