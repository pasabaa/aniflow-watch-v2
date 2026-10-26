'use client';

import * as React from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NextEpisodeOverlayProps {
  nextEpisodeNumber: number;
  onPlayNext: () => void;
  onCancel: () => void;
}

export function NextEpisodeOverlay({
  nextEpisodeNumber,
  onPlayNext,
  onCancel,
}: NextEpisodeOverlayProps) {
  const [secondsLeft, setSecondsLeft] = React.useState(10);

  React.useEffect(() => {
    if (secondsLeft <= 0) {
      onPlayNext();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onPlayNext]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 p-4 select-none">
      <div className="relative w-full max-w-sm rounded-sm border border-line bg-surface p-6 text-center shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 text-muted hover:text-ink cursor-pointer"
          aria-label="Cancelar autoplay"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
          SIGUIENTE EPISODIO EN
        </p>

        <div className="my-4 font-mono text-5xl font-black text-ink">
          {secondsLeft}s
        </div>

        <h3 className="mb-6 text-sm font-extrabold uppercase tracking-wider text-ink">
          EPISODIO {nextEpisodeNumber}
        </h3>

        <div className="flex items-center justify-center gap-3">
          <Button variant="primary" size="default" onClick={onPlayNext} className="gap-2">
            <Play className="h-4 w-4 fill-white" strokeWidth={1.5} />
            <span>REPRODUCIR YA</span>
          </Button>

          <Button variant="secondary" size="default" onClick={onCancel}>
            CANCELAR
          </Button>
        </div>
      </div>
    </div>
  );
}
