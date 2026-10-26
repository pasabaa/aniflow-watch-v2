import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EpisodeNavProps {
  slug: string;
  currentNumber: number;
  totalEpisodes?: number;
}

export function EpisodeNav({ slug, currentNumber, totalEpisodes }: EpisodeNavProps) {
  const hasPrev = currentNumber > 1;
  const hasNext = !totalEpisodes || currentNumber < totalEpisodes;

  return (
    <div className="flex items-center gap-3">
      {hasPrev ? (
        <Link href={`/media/${slug}/${currentNumber - 1}`} prefetch={true}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            <span>ANTERIOR</span>
          </Button>
        </Link>
      ) : (
        <Button variant="secondary" size="sm" disabled className="gap-1.5">
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          <span>ANTERIOR</span>
        </Button>
      )}

      <span className="font-mono text-xs font-bold text-ink px-2">
        EP. {currentNumber} {totalEpisodes ? `/ ${totalEpisodes}` : ''}
      </span>

      {hasNext ? (
        <Link href={`/media/${slug}/${currentNumber + 1}`} prefetch={true}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <span>SIGUIENTE</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </Link>
      ) : (
        <Button variant="secondary" size="sm" disabled className="gap-1.5">
          <span>SIGUIENTE</span>
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      )}
    </div>
  );
}
