import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number | null;
  size?: 'sm' | 'default';
}

export function Rating({ score, size = 'default', className, ...props }: RatingProps) {
  if (score === undefined || score === null || score <= 0) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-400 select-none',
        size === 'sm' && 'text-[11px]',
        className
      )}
      {...props}
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
      <span>{score.toFixed(1)}</span>
    </div>
  );
}
