import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  href?: string;
  actionText?: string;
}

export function SectionHeader({
  title,
  href,
  actionText = 'VER TODO',
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-ink border-l-2 border-accent pl-3">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-ink"
        >
          <span>{actionText}</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
