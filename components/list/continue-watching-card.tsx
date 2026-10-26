'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, MoreVertical, Trash2, Info, CheckCircle2, Film } from 'lucide-react';
import { ProgressBar } from './progress-bar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useProgressStore } from '@/store/progress';
import { useWatchlistStore } from '@/store/watchlist';
import { formatTimecode } from '@/lib/utils/format';
import type { ProgressMap } from '@/lib/upstream/types';

export interface ContinueWatchingCardProps {
  slug: string;
  item: ProgressMap[string];
}

export function ContinueWatchingCard({ slug, item }: ContinueWatchingCardProps) {
  const router = useRouter();
  const watchlistMap = useWatchlistStore((s) => s.items);
  const clearProgress = useProgressStore((s) => s.clearProgress);
  const markWatched = useProgressStore((s) => s.markWatched);

  const effectiveDuration = item.duration > 0 ? item.duration : 1420;
  const percent =
    item.duration > 0
      ? Math.min(100, Math.max(0, (item.position / item.duration) * 100))
      : item.position > 0
        ? Math.min(100, (item.position / 1420) * 100)
        : 0;
  const resumeUrl = `/media/${slug}/${item.episodeNumber}${item.position > 0 ? `?t=${Math.floor(item.position)}` : ''}`;
  const detailsUrl = `/media/${slug}`;

  // Image fallback resolution:
  // 1. Episode thumbnail (by mediaId or direct URL)
  // 2. Anime poster/cover (from item or watchlist)
  const episodeThumbnail =
    item.thumbnailUrl ||
    (item.mediaId ? `https://cdn.animeav1.com/thumbnails/${item.mediaId}.jpg` : undefined);
  const fallbackCover = item.poster || watchlistMap[slug]?.poster;

  const [imgSrc, setImgSrc] = React.useState<string | undefined>(
    episodeThumbnail || fallbackCover
  );
  const [hasFailedThumbnail, setHasFailedThumbnail] = React.useState(false);
  const [hasFailedAll, setHasFailedAll] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(episodeThumbnail || fallbackCover);
    setHasFailedThumbnail(false);
    setHasFailedAll(false);
  }, [episodeThumbnail, fallbackCover]);

  const handleImageError = () => {
    if (!hasFailedThumbnail && fallbackCover && imgSrc !== fallbackCover) {
      setHasFailedThumbnail(true);
      setImgSrc(fallbackCover);
    } else {
      setHasFailedAll(true);
      setImgSrc(undefined);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearProgress(slug);
  };

  const handleMarkWatched = (e: React.MouseEvent) => {
    e.stopPropagation();
    markWatched(slug, item.episodeNumber);
    clearProgress(slug);
  };

  const handleNavigateDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(detailsUrl);
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(resumeUrl);
  };

  return (
    <div className="group relative w-[220px] sm:w-[260px] shrink-0 select-none">
      <Link
        href={resumeUrl}
        prefetch={true}
        className="block rounded-sm border border-line bg-surface p-2.5 transition-colors hover:border-neutral-700"
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-[#121212] mb-2 border border-line/40">
          {imgSrc && !hasFailedAll ? (
            <img
              src={imgSrc}
              alt={item.title}
              onError={handleImageError}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center p-3 text-center bg-[#141414]">
              <Film className="h-6 w-6 text-muted mb-1 opacity-60" strokeWidth={1.5} />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
                {item.title}
              </span>
            </div>
          )}

          {/* Hover Play Button */}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-5 w-5 fill-white ml-0.5" strokeWidth={1.5} />
            </div>
          </div>

          {/* Progress Bar at bottom of thumbnail */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <ProgressBar percent={percent} height="sm" />
          </div>
        </div>

        {/* Text Meta */}
        <div className="px-1">
          <h4 className="truncate text-xs font-bold uppercase tracking-wider text-ink group-hover:text-white">
            {item.title}
          </h4>
          <div className="mt-1 flex items-center justify-between text-[10px] text-muted font-mono uppercase">
            <span>EPISODIO {item.episodeNumber}</span>
            <span>
              {item.position > 0
                ? `${formatTimecode(item.position)} / ${formatTimecode(effectiveDuration)}`
                : 'COMENZAR'}
            </span>
          </div>
        </div>
      </Link>

      {/* Accessible Dropdown Action Menu */}
      <div className="absolute top-4 right-4 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-sm border border-line bg-black/85 text-ink transition-colors hover:border-neutral-500 hover:bg-black hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              aria-label={`Opciones de ${item.title}`}
            >
              <MoreVertical className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate border-b border-line pb-1.5 mb-1 text-[10px]">
              {item.title}
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={handleResume}>
              <Play className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} />
              <span>REANUDAR EPISODIO {item.episodeNumber}</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleNavigateDetails}>
              <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>VER DETALLES</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleMarkWatched}>
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>MARCAR COMO VISTO</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={handleRemove}>
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>ELIMINAR DE ESTA LISTA</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
