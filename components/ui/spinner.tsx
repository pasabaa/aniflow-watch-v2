import { cn } from '@/lib/utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
}

export function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  }[size];

  return (
    <div
      role="status"
      className={cn(
        'inline-block animate-spin rounded-full border-line border-t-accent',
        sizeClasses,
        className
      )}
      {...props}
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
