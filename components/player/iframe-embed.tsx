import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface IframeEmbedProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  src: string;
  title?: string;
}

export function IframeEmbed({ src, title = 'Reproductor externo', className, ...props }: IframeEmbedProps) {
  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-sm bg-black border border-line', className)}>
      <iframe
        src={src}
        title={title}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        {...props}
      />
    </div>
  );
}
