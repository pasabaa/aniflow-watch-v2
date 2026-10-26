'use client';

import * as React from 'react';
import Image from 'next/image';

export interface MediaBackdropProps {
  src?: string;
  fallbackSrc?: string;
  alt: string;
}

export function MediaBackdrop({ src, fallbackSrc, alt }: MediaBackdropProps) {
  const [currentSrc, setCurrentSrc] = React.useState<string | undefined>(src || fallbackSrc);

  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  if (!currentSrc) return null;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      priority
      sizes="100vw"
      className="object-cover object-top opacity-50 transition-opacity duration-300"
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setCurrentSrc(undefined);
        }
      }}
    />
  );
}
