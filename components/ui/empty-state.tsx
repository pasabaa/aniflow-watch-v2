import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col items-center justify-center border border-dashed border-line p-8 text-center rounded-sm',
        className
      )}
      {...props}
    >
      {icon && <div className="mb-4 text-muted">{icon}</div>}
      <h3 className="text-sm font-extrabold uppercase tracking-widest text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
