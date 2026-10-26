'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/list/progress-bar';
import { cn } from '@/lib/utils/cn';
import type { Episode } from '@/lib/upstream/types';

export interface EpisodeCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  slug: string;
  episode: Episode;
  thumbnailUrl?: string;
  isWatched?: boolean;
  progressPercent?: number;
  currentNumber?: number;
}

export function EpisodeCard({
  slug,
  episode,
  thumbnailUrl,
  isWatched = false,
  progressPercent = 0,
  currentNumber,
  className,
  ...props
}: EpisodeCardProps) {
  const isCurrent = currentNumber === episode.number;
  const [imgSrc, setImgSrc] = React.useState(thumbnailUrl || '/images/placeholder-poster.svg');

  React.useEffect(() => {
    setImgSrc(thumbnailUrl || '/images/placeholder-poster.svg');
  }, [thumbnailUrl]);

  return (
    <Link
      href={`/media/${slug}/${episode.number}`}
      prefetch={true}
      className={cn(
        'group flex flex-col sm:flex-row gap-3 rounded-sm border p-2.5 transition-colors select-none',
        isCurrent
          ? 'border-accent bg-surface'
          : 'border-line bg-surface hover:border-neutral-700',
        className
      )}
      {...props}
    >
      <div className="relative aspect-video w-full sm:w-44 shrink-0 overflow-hidden rounded-sm bg-line">
        <Image
          src={imgSrc}
          alt={`Episodio ${episode.number}`}
          fill
          sizes="(max-width: 640px) 100vw, 176px"
          className="object-cover transition-transform group-hover:scale-105"
          onError={() => setImgSrc('/images/placeholder-poster.svg')}
        />

        {/* Scrim overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-md">
            <Play className="h-5 w-5 fill-white ml-0.5" strokeWidth={1.5} />
          </div>
        </div>

        {isWatched && (
          <div className="absolute top-1.5 right-1.5 rounded-sm bg-black/80 p-1 border border-line">
            <Check className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
          </div>
        )}

        {progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0">
            <ProgressBar percent={progressPercent} height="sm" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center min-w-0 py-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
            EPISODIO {episode.number}
          </span>
          {episode.variants?.DUB && <Badge variant="dub">DUB</Badge>}
          <Badge variant="sub">SUB</Badge>
        </div>

        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider truncate group-hover:text-ink transition-colors">
          {episode.title || `Episodio ${episode.number}`}
        </h4>
      </div>
    </Link>
  );
}
