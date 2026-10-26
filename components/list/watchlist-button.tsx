'use client';

import * as React from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWatchlistStore } from '@/store/watchlist';
import { useHydrated } from '@/store/hydration';
import type { NormalizedMedia } from '@/lib/upstream/types';

export interface WatchlistButtonProps {
  media: {
    slug: string;
    title: string;
    poster: string;
  } | NormalizedMedia;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
}

export function WatchlistButton({
  media,
  size = 'default',
  variant = 'secondary',
}: WatchlistButtonProps) {
  const hydrated = useHydrated();
  const isInStore = useWatchlistStore((s) => !!s.items[media.slug]);
  const toggleItem = useWatchlistStore((s) => s.toggleItem);

  // Optimistic local state
  const [optimisticInList, setOptimisticInList] = React.useState(false);

  React.useEffect(() => {
    if (hydrated) {
      setOptimisticInList(isInStore);
    }
  }, [hydrated, isInStore]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Immediate optimistic toggle
    setOptimisticInList((prev) => !prev);
    toggleItem({
      slug: media.slug,
      title: media.title,
      poster: media.poster,
    });
  };

  const active = hydrated && optimisticInList;

  return (
    <Button
      type="button"
      variant={active ? 'outline' : variant}
      size={size}
      onClick={handleToggle}
      className={active ? 'border-accent text-accent' : ''}
      aria-label={active ? 'Quitar de mi lista' : 'Añadir a mi lista'}
    >
      {active ? (
        <>
          <Check className="h-4 w-4 text-accent" strokeWidth={1.5} />
          {size !== 'icon' && <span>EN MI LISTA</span>}
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          {size !== 'icon' && <span>MI LISTA</span>}
        </>
      )}
    </Button>
  );
}
