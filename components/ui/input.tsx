import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', icon, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {icon && (
          <div className="pointer-events-none absolute left-3 flex items-center justify-center text-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-9',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
