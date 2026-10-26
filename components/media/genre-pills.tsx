import * as React from 'react';
import Link from 'next/link';
import { Chip } from '@/components/ui/chip';
import { cn } from '@/lib/utils/cn';

export interface GenrePillsProps extends React.HTMLAttributes<HTMLDivElement> {
  genres: { id: number; name: string; slug: string }[];
  activeSlug?: string;
  baseUrl?: string;
}

export function GenrePills({
  genres,
  activeSlug,
  baseUrl = '/genero',
  className,
  ...props
}: GenrePillsProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
      {genres.map((genre) => {
        const isActive = activeSlug === genre.slug;
        const href = baseUrl === '/genero' ? `/genero/${genre.slug}` : `${baseUrl}?genre=${genre.slug}`;

        return (
          <Link key={genre.id || genre.slug} href={href} prefetch={true}>
            <Chip active={isActive} clickable>
              {genre.name}
            </Chip>
          </Link>
        );
      })}
    </div>
  );
}
