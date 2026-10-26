'use client';

import * as React from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { ScrollRow } from '@/components/ui/scroll-row';
import { ContinueWatchingCard } from './continue-watching-card';
import { useProgressStore } from '@/store/progress';
import { useHydrated } from '@/store/hydration';

export function ContinueRow({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const progressMap = useProgressStore((s) => s.progress);

  if (!hydrated) return null;

  // Include any series actively watched that hasn't been dismissed by the user
  const inProgressList = Object.entries(progressMap)
    .filter(
      ([_, item]) =>
        Boolean(item && item.title && typeof item.episodeNumber === 'number')
    )
    .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0));

  if (inProgressList.length === 0) return null;

  return (
    <div className={className}>
      <SectionHeader title="CONTINUAR VIENDO" />
      <ScrollRow>
        {inProgressList.map(([slug, item]) => (
          <ContinueWatchingCard key={slug} slug={slug} item={item} />
        ))}
      </ScrollRow>
    </div>
  );
}
