import * as React from 'react';
import { Server as ServerIcon, Zap, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import type { EpisodeSource } from '@/lib/upstream/types';

export interface ServerSelectorProps {
  servers: EpisodeSource['servers'];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function ServerSelector({
  servers,
  selectedIndex,
  onSelect,
  className,
}: ServerSelectorProps) {
  if (!servers || servers.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
        <ServerIcon className="h-4 w-4" strokeWidth={1.5} />
        <span>SERVIDORES DISPONIBLES</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {servers.map((server, idx) => {
          const isSelected = selectedIndex === idx;
          const isHls = server.type === 'hls';

          return (
            <button
              key={`${server.name}-${idx}`}
              type="button"
              onClick={() => onSelect(idx)}
              className={cn(
                'flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none',
                isSelected
                  ? 'border-accent bg-surface text-ink'
                  : 'border-line bg-surface text-muted hover:border-neutral-600 hover:text-ink'
              )}
            >
              {isHls ? (
                <Zap className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
              ) : (
                <ExternalLink className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
              )}
              <span>{server.name}</span>
              <Badge variant={isHls ? 'accent' : 'default'} className="text-[9px]">
                {isHls ? 'HLS' : 'EMBED'}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
