import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sub' | 'dub' | 'new' | 'default' | 'accent';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    sub: 'bg-surface text-ink border border-line',
    dub: 'bg-surface text-amber-400 border border-amber-900/50',
    new: 'bg-accent text-white font-extrabold',
    default: 'bg-surface text-muted border border-line',
    accent: 'bg-accent text-white',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm select-none',
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
