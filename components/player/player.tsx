'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { IframeEmbed } from './iframe-embed';
import { NextEpisodeOverlay } from './next-episode-overlay';
import type { EpisodeSource } from '@/lib/upstream/types';

export interface PlayerProps {
  title: string;
  poster?: string;
  server: EpisodeSource['servers'][number];
  nextEpisodeNumber?: number;
  onPlayNext?: () => void;
  onTimeUpdate?: (data: { position: number; duration: number }) => void;
  autoPlayNextEnabled?: boolean;
}

export function Player({
  title,
  poster,
  server,
  nextEpisodeNumber,
  onPlayNext,
  onTimeUpdate,
  autoPlayNextEnabled = true,
}: PlayerProps) {
  const searchParams = useSearchParams();
  const playerRef = React.useRef<MediaPlayerInstance>(null);

  const [showNextOverlay, setShowNextOverlay] = React.useState(false);
  const [overlayDismissed, setOverlayDismissed] = React.useState(false);

  // Resume playback with ?t= parameter
  const initialTimeParam = searchParams.get('t');
  const initialTime = initialTimeParam ? parseFloat(initialTimeParam) : 0;

  // Handle HLS stream proxy URL
  const isHls = server.type === 'hls';
  const videoSrc = isHls
    ? `/api/stream/manifest?url=${encodeURIComponent(server.url)}`
    : server.url;

  // Track time updates
  const handleTimeUpdate = (detail: { currentTime: number }) => {
    const currentTime =
      typeof detail?.currentTime === 'number'
        ? detail.currentTime
        : (playerRef.current?.currentTime ?? 0);

    const playerDuration = playerRef.current?.duration;
    const duration =
      typeof playerDuration === 'number' && !isNaN(playerDuration) && isFinite(playerDuration)
        ? playerDuration
        : ((playerRef.current as any)?.state?.duration ?? 0);

    if (onTimeUpdate && !isNaN(currentTime)) {
      onTimeUpdate({ position: currentTime, duration: duration > 0 ? duration : 0 });
    }

    // 90% reached trigger for next episode overlay
    if (
      autoPlayNextEnabled &&
      nextEpisodeNumber &&
      !overlayDismissed &&
      duration > 0 &&
      currentTime >= duration * 0.9
    ) {
      setShowNextOverlay(true);
    }
  };

  const handleLoadedMetadata = () => {
    const playerDuration = playerRef.current?.duration;
    const duration =
      typeof playerDuration === 'number' && !isNaN(playerDuration) && isFinite(playerDuration)
        ? playerDuration
        : 0;

    const currentTime = playerRef.current?.currentTime || initialTime;
    if (onTimeUpdate && duration > 0) {
      onTimeUpdate({ position: currentTime, duration });
    }
  };

  // If server is embed fallback
  if (!isHls) {
    return (
      <div className="relative aspect-video w-full">
        <IframeEmbed src={server.url} title={title} />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black border border-line">
      <MediaPlayer
        ref={playerRef}
        title={title}
        src={{ src: videoSrc, type: 'application/x-mpegurl' }}
        poster={poster}
        currentTime={initialTime}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="h-full w-full"
        playsInline
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>

      {/* 10s countdown next episode overlay */}
      {showNextOverlay && nextEpisodeNumber && onPlayNext && (
        <NextEpisodeOverlay
          nextEpisodeNumber={nextEpisodeNumber}
          onPlayNext={onPlayNext}
          onCancel={() => {
            setShowNextOverlay(false);
            setOverlayDismissed(true);
          }}
        />
      )}
    </div>
  );
}
