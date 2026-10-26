'use client';

import * as React from 'react';
import { EpisodeCard } from './episode-card';
import { useProgressStore } from '@/store/progress';
import { useHydrated } from '@/store/hydration';
import type { Episode } from '@/lib/upstream/types';

export interface EpisodeListProps {
  slug: string;
  episodes: Episode[];
  thumbnailUrl?: string;
  currentNumber?: number;
}

const EMPTY_HISTORY: number[] = [];

export function EpisodeList({
  slug,
  episodes,
  thumbnailUrl,
  currentNumber,
}: EpisodeListProps) {
  const hydrated = useHydrated();
  const history = useProgressStore((s) => s.history[slug]) || EMPTY_HISTORY;
  const progress = useProgressStore((s) => s.progress[slug]);

  // Batching into tabs of 25 if many episodes
  const batchSize = 25;
  const totalBatches = Math.ceil(episodes.length / batchSize);
  const [selectedBatch, setSelectedBatch] = React.useState(0);

  // If current episode is in a specific batch, default to that batch
  React.useEffect(() => {
    if (currentNumber && episodes.length > batchSize) {
      const idx = episodes.findIndex((e) => e.number === currentNumber);
      if (idx !== -1) {
        setSelectedBatch(Math.floor(idx / batchSize));
      }
    }
  }, [currentNumber, episodes]);

  const visibleEpisodes =
    totalBatches > 1
      ? episodes.slice(selectedBatch * batchSize, (selectedBatch + 1) * batchSize)
      : episodes;

  return (
    <div className="space-y-4">
      {/* Batch selector buttons if many episodes */}
      {totalBatches > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-line pb-3">
          {Array.from({ length: totalBatches }).map((_, idx) => {
            const start = idx * batchSize + 1;
            const end = Math.min((idx + 1) * batchSize, episodes.length);
            const active = selectedBatch === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedBatch(idx)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm border transition-colors cursor-pointer ${
                  active
                    ? 'bg-ink text-bg border-ink'
                    : 'bg-surface text-muted border-line hover:border-neutral-600'
                }`}
              >
                {start} - {end}
              </button>
            );
          })}
        </div>
      )}

      {/* Episode grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibleEpisodes.map((ep) => {
          const isWatched = hydrated && history.includes(ep.number);
          let progressPercent = 0;
          if (hydrated && progress && progress.episodeNumber === ep.number && progress.duration > 0) {
            progressPercent = (progress.position / progress.duration) * 100;
          }

          return (
            <EpisodeCard
              key={ep.id || ep.number}
              slug={slug}
              episode={ep}
              thumbnailUrl={thumbnailUrl}
              isWatched={isWatched}
              progressPercent={progressPercent}
              currentNumber={currentNumber}
            />
          );
        })}
      </div>
    </div>
  );
}
