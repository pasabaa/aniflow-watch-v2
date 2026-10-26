'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Player } from './player';
import { ServerSelector } from './server-selector';
import { AudioSelector } from './audio-selector';
import { EpisodeNav } from './episode-nav';
import { useProgressStore } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';
import type { NormalizedMedia, Episode, EpisodeSource } from '@/lib/upstream/types';

export interface PlayerShellProps {
  media: NormalizedMedia;
  episode: Episode;
  sources: EpisodeSource;
  totalEpisodes?: number;
  initialAudio?: 'SUB' | 'DUB';
}

export function PlayerShell({
  media,
  episode,
  sources,
  totalEpisodes,
  initialAudio = 'SUB',
}: PlayerShellProps) {
  const router = useRouter();
  const recordEpisodeAccess = useProgressStore((s) => s.recordEpisodeAccess);
  const updateProgress = useProgressStore((s) => s.updateProgress);
  const autoplayNext = useSettingsStore((s) => s.autoplayNext);

  // Immediately record episode access into history & progress on mount or episode change
  React.useEffect(() => {
    recordEpisodeAccess(media.slug, {
      episodeNumber: episode.number,
      title: media.title,
      poster: media.poster,
      mediaId: media.id,
      thumbnailUrl:
        media.id > 0
          ? `https://cdn.animeav1.com/thumbnails/${media.id}.jpg`
          : media.backdrop || media.poster,
    });
  }, [
    media.slug,
    episode.number,
    media.title,
    media.poster,
    media.id,
    media.backdrop,
    recordEpisodeAccess,
  ]);

  const [selectedAudio, setSelectedAudio] = React.useState<'SUB' | 'DUB'>(initialAudio);
  const [selectedServerIndex, setSelectedServerIndex] = React.useState(0);

  const currentServer = sources.servers[selectedServerIndex] || sources.servers[0];
  const hasNextEpisode = !totalEpisodes || episode.number < totalEpisodes;
  const nextEpisodeNumber = hasNextEpisode ? episode.number + 1 : undefined;

  const handlePlayNext = React.useCallback(() => {
    if (nextEpisodeNumber) {
      router.push(`/media/${media.slug}/${nextEpisodeNumber}`);
    }
  }, [nextEpisodeNumber, media.slug, router]);

  const handleAudioChange = (newAudio: 'SUB' | 'DUB') => {
    setSelectedAudio(newAudio);
    router.push(`/media/${media.slug}/${episode.number}?audio=${newAudio}`);
  };

  // Throttled progress update
  const lastUpdatedRef = React.useRef(0);
  const handleTimeUpdate = ({ position, duration }: { position: number; duration: number }) => {
    const now = Date.now();
    if (now - lastUpdatedRef.current > 2000) {
      lastUpdatedRef.current = now;
      updateProgress(media.slug, {
        episodeNumber: episode.number,
        position,
        duration,
        title: media.title,
        poster: media.poster,
        mediaId: media.id,
        thumbnailUrl:
          media.id > 0
            ? `https://cdn.animeav1.com/thumbnails/${media.id}.jpg`
            : media.backdrop || media.poster,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="w-full">
        {currentServer ? (
          <Player
            key={`${currentServer.url}-${episode.number}`}
            title={`${media.title} - Episodio ${episode.number}`}
            poster={media.backdrop || media.poster}
            server={currentServer}
            nextEpisodeNumber={nextEpisodeNumber}
            onPlayNext={handlePlayNext}
            onTimeUpdate={handleTimeUpdate}
            autoPlayNextEnabled={autoplayNext}
          />
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-surface border border-line rounded-sm text-xs font-bold uppercase tracking-widest text-muted">
            No hay servidores disponibles para este episodio
          </div>
        )}
      </div>

      {/* Primary Action Bar: Navigation + Audio Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <Link
            href={`/media/${media.slug}`}
            className="text-xs uppercase font-bold tracking-widest text-muted hover:text-ink transition-colors block mb-1"
          >
            ← VOLVER A {media.title}
          </Link>
          <h1 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
            EPISODIO {episode.number} {episode.title ? `— ${episode.title}` : ''}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <AudioSelector
            variants={episode.variants}
            currentAudio={selectedAudio}
            onChange={handleAudioChange}
          />
          <EpisodeNav
            slug={media.slug}
            currentNumber={episode.number}
            totalEpisodes={totalEpisodes}
          />
        </div>
      </div>

      {/* Server Selector Bar */}
      <ServerSelector
        servers={sources.servers}
        selectedIndex={selectedServerIndex}
        onSelect={setSelectedServerIndex}
      />
    </div>
  );
}
