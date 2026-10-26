'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from './skeleton';

export interface PosterProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
}

export function Poster({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px',
  fallbackSrc = '/images/placeholder-poster.svg',
  className,
  ...props
}: PosterProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const finalSrc = error || !src ? fallbackSrc : src;

  return (
    <div
      className={cn(
        'relative aspect-[2/3] w-full overflow-hidden rounded-sm bg-surface border border-line',
        className
      )}
      {...props}
    >
      {loading && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none" />
      )}
      <Image
        src={finalSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          'object-cover transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
