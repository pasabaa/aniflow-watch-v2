'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Hero } from './hero';
import { cn } from '@/lib/utils/cn';
import type { NormalizedMedia } from '@/lib/upstream/types';

export interface CarouselProps {
  items: NormalizedMedia[];
  className?: string;
}

export function Carousel({ items, className }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!items || items.length === 0) return null;

  return (
    <div className={cn('relative w-full', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((media) => (
            <div key={media.id} className="min-w-0 flex-[0_0_100%]">
              <Hero media={media} />
            </div>
          ))}
        </div>
      </div>

      {/* Brutalist Slide Indicator Bars */}
      {items.length > 1 && (
        <div className="absolute bottom-4 right-8 z-20 hidden sm:flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
              className={cn(
                'h-1 transition-all rounded-none cursor-pointer',
                selectedIndex === idx
                  ? 'w-8 bg-accent'
                  : 'w-4 bg-line hover:bg-neutral-600'
              )}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
