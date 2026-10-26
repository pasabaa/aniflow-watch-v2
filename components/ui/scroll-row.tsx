'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ScrollRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showControls?: boolean;
}

export function ScrollRow({ children, showControls = true, className, ...props }: ScrollRowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className={cn('relative group', className)} {...props}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">{children}</div>
      </div>

      {showControls && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              'absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all hover:border-ink disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-lg',
              !canScrollPrev && 'opacity-0'
            )}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              'absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all hover:border-ink disabled:opacity-0 disabled:pointer-events-none cursor-pointer shadow-lg',
              !canScrollNext && 'opacity-0'
            )}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </>
      )}
    </div>
  );
}
