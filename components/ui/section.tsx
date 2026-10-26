import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Section({ as: Component = 'section', className, children, ...props }: SectionProps) {
  return (
    <Component className={cn('py-8 sm:py-10', className)} {...props}>
      {children}
    </Component>
  );
}
