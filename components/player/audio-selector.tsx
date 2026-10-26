import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface AudioSelectorProps {
  variants?: Record<'SUB' | 'DUB', boolean>;
  currentAudio: 'SUB' | 'DUB';
  onChange: (audio: 'SUB' | 'DUB') => void;
  className?: string;
}

export function AudioSelector({
  variants = { SUB: true, DUB: false },
  currentAudio,
  onChange,
  className,
}: AudioSelectorProps) {
  const hasDub = variants.DUB === true;

  return (
    <div className={cn('inline-flex items-center rounded-sm border border-line bg-surface p-0.5', className)}>
      <button
        type="button"
        onClick={() => onChange('SUB')}
        className={cn(
          'px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer',
          currentAudio === 'SUB'
            ? 'bg-ink text-bg'
            : 'text-muted hover:text-ink'
        )}
      >
        SUB
      </button>

      {hasDub && (
        <button
          type="button"
          onClick={() => onChange('DUB')}
          className={cn(
            'px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer',
            currentAudio === 'DUB'
              ? 'bg-amber-400 text-bg'
              : 'text-muted hover:text-ink'
          )}
        >
          DUB
        </button>
      )}
    </div>
  );
}
