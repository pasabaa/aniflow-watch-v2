import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInfoData, getSourcesData } from '@/lib/upstream/loaders';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { PlayerShell } from '@/components/player/player-shell';
import { EpisodeList } from '@/components/media/episode-list';

export interface EpisodePageProps {
  params: Promise<{
    slug: string;
    number: string;
  }>;
  searchParams: Promise<{
    audio?: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = [
    'cyberpunk-edgerunners-2',
    'one-piece',
    'shinja-zero-no-megami-sama-to-hajimeru-isekai-kouryaku',
    'sasaki-to-pii-chan-season-2',
  ];
  const params: { slug: string; number: string }[] = [];
  for (const slug of slugs) {
    for (let i = 1; i <= 3; i++) {
      params.push({ slug, number: String(i) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const { slug, number } = await params;
  const { media } = await getInfoData(slug);

  return {
    title: `${media.title} - Episodio ${number}`,
    description: `Reproducir episodio ${number} de ${media.title} online en Flow.`,
    openGraph: {
      title: `${media.title} - Episodio ${number}`,
      images: media.poster ? [{ url: media.poster }] : [],
    },
  };
}

export default async function EpisodePlayerPage({
  params,
}: {
  params: Promise<{
    slug: string;
    number: string;
  }>;
}) {
  const { slug, number: rawNumber } = await params;
  const episodeNumber = parseInt(rawNumber, 10);
  if (isNaN(episodeNumber)) {
    notFound();
  }
  const audio = 'SUB';

  const [info, sources] = await Promise.all([
    getInfoData(slug),
    getSourcesData(slug, episodeNumber, audio),
  ]);

  if (!info || !info.media) {
    notFound();
  }

  const currentEpisode =
    info.episodes.find((e) => e.number === episodeNumber) || {
      id: episodeNumber,
      number: episodeNumber,
      title: `Episodio ${episodeNumber}`,
      slug: `${slug}-${episodeNumber}`,
      variants: { SUB: true, DUB: false },
    };

  return (
    <Container className="py-8 space-y-10">
      {/* Player Layout Shell */}
      <React.Suspense
        fallback={
          <div className="aspect-video w-full flex items-center justify-center bg-surface border border-line rounded-sm text-xs font-bold uppercase tracking-widest text-muted">
            CARGANDO REPRODUCTOR...
          </div>
        }
      >
        <PlayerShell
          media={info.media}
          episode={currentEpisode}
          sources={sources}
          totalEpisodes={info.media.episodeCount || info.episodes.length}
          initialAudio={audio}
        />
      </React.Suspense>

      {/* Episode Selection List */}
      <Section className="border-t border-line pt-8">
        <h2 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-ink">
          TODOS LOS EPISODIOS ({info.episodes.length})
        </h2>

        <EpisodeList
          slug={slug}
          episodes={info.episodes}
          thumbnailUrl={
            info.media.id > 0
              ? `https://cdn.animeav1.com/thumbnails/${info.media.id}.jpg`
              : info.media.backdrop || info.media.poster
          }
          currentNumber={episodeNumber}
        />
      </Section>
    </Container>
  );
}
