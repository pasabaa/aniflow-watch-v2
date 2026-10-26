import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percent: number;
  height?: 'sm' | 'default' | 'lg';
}

export function ProgressBar({ percent, height = 'default', className, ...props }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  const heightClasses = {
    sm: 'h-1',
    default: 'h-1.5',
    lg: 'h-2',
  }[height];

  return (
    <div
      className={cn('w-full bg-line overflow-hidden rounded-none', heightClasses, className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className="h-full bg-accent transition-all duration-200"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
