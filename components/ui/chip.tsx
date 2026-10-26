import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  clickable?: boolean;
}

export function Chip({ className, active, clickable, children, ...props }: ChipProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border select-none transition-colors',
        active
          ? 'bg-ink text-bg border-ink'
          : 'bg-surface text-muted border-line hover:border-neutral-600',
        clickable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
