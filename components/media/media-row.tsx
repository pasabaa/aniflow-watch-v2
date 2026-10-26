import * as React from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { ScrollRow } from '@/components/ui/scroll-row';
import { MediaCard } from './media-card';
import type { NormalizedMedia } from '@/lib/upstream/types';

export interface MediaRowProps {
  title: string;
  items: NormalizedMedia[];
  href?: string;
  className?: string;
}

export function MediaRow({ title, items, href, className }: MediaRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={className}>
      <SectionHeader title={title} href={href} />
      <ScrollRow>
        {items.map((media) => (
          <div
            key={media.id}
            className="w-[140px] sm:w-[165px] md:w-[185px] shrink-0"
          >
            <MediaCard media={media} />
          </div>
        ))}
      </ScrollRow>
    </div>
  );
}
