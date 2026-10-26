import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { WatchlistButton } from '@/components/list/watchlist-button';
import type { NormalizedMedia } from '@/lib/upstream/types';

export interface HeroProps {
  media: NormalizedMedia;
}

export function Hero({ media }: HeroProps) {
  const backdropUrl = media.backdrop || media.poster;

  return (
    <div className="relative w-full border-b border-line bg-surface">
      {/* Backdrop Image */}
      <div className="relative h-[480px] sm:h-[560px] md:h-[620px] w-full overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={media.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        )}

        {/* Scrim: Sólido bg-black/60 (CERO gradientes) */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Bloque sólido bg-bg debajo para fusión brutalista */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-bg border-t border-line" />

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="sub">{media.type}</Badge>
                {media.status === 'ongoing' && <Badge variant="accent">EN EMISIÓN</Badge>}
                {media.rating && (
                  <div className="rounded-sm bg-surface px-2 py-0.5 border border-line">
                    <Rating score={media.rating} />
                  </div>
                )}
                {media.year && (
                  <span className="font-mono text-xs text-muted font-bold">{media.year}</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-ink">
                {media.title}
              </h1>

              {media.alternativeTitle && (
                <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                  {media.alternativeTitle}
                </p>
              )}

              {media.synopsis && (
                <p className="mt-4 line-clamp-3 text-xs sm:text-sm text-ink/80 leading-relaxed max-w-xl">
                  {media.synopsis}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href={`/media/${media.slug}/1`} prefetch={true}>
                  <Button variant="primary" size="lg" className="gap-2">
                    <Play className="h-4 w-4 fill-white" strokeWidth={1.5} />
                    <span>REPRODUCIR EP. 1</span>
                  </Button>
                </Link>

                <WatchlistButton media={media} size="lg" />

                <Link href={`/media/${media.slug}`} prefetch={true}>
                  <Button variant="secondary" size="lg">
                    VER DETALLES
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
