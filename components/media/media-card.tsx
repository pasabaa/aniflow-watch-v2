'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MoreVertical,
  BookmarkPlus,
  BookmarkCheck,
  Play,
  Info,
  Share2,
  Check,
  Tag,
} from 'lucide-react';
import { Poster } from '@/components/ui/poster';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useWatchlistStore } from '@/store/watchlist';
import { useHydrated } from '@/store/hydration';
import { cn } from '@/lib/utils/cn';
import type { NormalizedMedia } from '@/lib/upstream/types';

export interface MediaCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'media'> {
  media: NormalizedMedia;
  showRating?: boolean;
  priority?: boolean;
}

export function MediaCard({
  media,
  showRating = true,
  priority = false,
  className,
  ...props
}: MediaCardProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const isInWatchlist = useWatchlistStore((s) => s.isInWatchlist(media.slug));
  const toggleItem = useWatchlistStore((s) => s.toggleItem);
  const inWatchlist = hydrated && isInWatchlist;

  const [copied, setCopied] = React.useState(false);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem({
      slug: media.slug,
      title: media.title,
      poster: media.poster,
    });
  };

  const handlePlayFirst = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/media/${media.slug}/1`);
  };

  const handleNavigateDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/media/${media.slug}`);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/media/${media.slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const firstGenre = media.genres?.[0];

  return (
    <div className="group relative block select-none rounded-sm border border-line bg-surface p-2 transition-colors hover:border-neutral-700">
      <Link
        href={`/media/${media.slug}`}
        prefetch={true}
        className={cn('block focus-visible:outline-none', className)}
        {...props}
      >
        <div className="relative mb-2 aspect-[2/3] w-full overflow-hidden rounded-sm bg-[#121212]">
          <Poster src={media.poster} alt={media.title} priority={priority} />

          {/* Type Badge */}
          <div className="absolute top-1.5 left-1.5 z-10 flex gap-1">
            <Badge variant="sub">{media.type}</Badge>
          </div>

          {/* Rating */}
          {showRating && media.rating && (
            <div className="absolute bottom-1.5 right-1.5 z-10 rounded-sm bg-black/85 px-1.5 py-0.5 border border-line">
              <Rating score={media.rating} size="sm" />
            </div>
          )}
        </div>

        <div className="px-1">
          <h3 className="truncate text-xs font-bold uppercase tracking-wider text-ink transition-colors group-hover:text-white">
            {media.title}
          </h3>

          <div className="mt-1 flex items-center justify-between text-[10px] text-muted uppercase font-mono">
            <span>{media.year || '2024'}</span>
            <span>{media.episodeCount ? `${media.episodeCount} EPS` : 'EN EMISIÓN'}</span>
          </div>
        </div>
      </Link>

      {/* Accessible Quick Actions Dropdown */}
      <div className="absolute top-3.5 right-3.5 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-sm border border-line bg-black/80 text-ink opacity-90 transition-all hover:bg-black hover:border-neutral-500 hover:text-white group-hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              aria-label={`Opciones de ${media.title}`}
            >
              <MoreVertical className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate border-b border-line pb-1.5 mb-1 text-[10px]">
              {media.title}
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={handleToggleWatchlist}>
              {inWatchlist ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                  <span>QUITAR DE MI LISTA</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>AGREGAR A MI LISTA</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handlePlayFirst}>
              <Play className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} />
              <span>VER EPISODIO 1</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleNavigateDetails}>
              <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>VER DETALLES</span>
            </DropdownMenuItem>

            {firstGenre && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/genero/${firstGenre.slug}`);
                }}
              >
                <Tag className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>GÉNERO: {firstGenre.name}</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.5} />
                  <span className="text-emerald-400">¡ENLACE COPIADO!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>COPIAR ENLACE</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
