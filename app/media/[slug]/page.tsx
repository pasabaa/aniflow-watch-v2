import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play } from 'lucide-react';
import { getInfoData } from '@/lib/upstream/loaders';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { GenrePills } from '@/components/media/genre-pills';
import { EpisodeList } from '@/components/media/episode-list';
import { MediaBackdrop } from '@/components/media/media-backdrop';
import { MediaRow } from '@/components/media/media-row';
import { WatchlistButton } from '@/components/list/watchlist-button';

export interface MediaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'cyberpunk-edgerunners-2' },
    { slug: 'one-piece' },
    { slug: 'shinja-zero-no-megami-sama-to-hajimeru-isekai-kouryaku' },
    { slug: 'sasaki-to-pii-chan-season-2' },
    { slug: 'tantei-wa-mou-shindeiru-season-2' },
    { slug: 'jujutsu-kaisen-season-2' },
    { slug: 'bleach-sennen-kessen-hen-soukokutan' },
    { slug: 'solo-leveling-season-2-arise-from-the-shadow' },
    { slug: 'kimetsu-no-yaiba-hashira-geiko-hen' },
    { slug: 'chainsaw-man' },
    { slug: 'boku-no-hero-academia-7th-season' },
    { slug: 'sousou-no-frieren' },
  ];
}

export async function generateMetadata({ params }: MediaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { media } = await getInfoData(slug);

  return {
    title: media.title,
    description: media.synopsis || `Ver ${media.title} online en Flow.`,
    openGraph: {
      title: media.title,
      description: media.synopsis,
      images: media.poster ? [{ url: media.poster }] : [],
    },
  };
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { slug } = await params;
  const data = await getInfoData(slug);

  if (!data || !data.media) {
    notFound();
  }

  const { media, episodes, relations } = data;
  const backdropUrl = media.backdrop || media.poster;

  return (
    <div className="space-y-8 pb-16">
      {/* Detalle Hero */}
      <div className="relative w-full border-b border-line bg-surface">
        <div className="relative min-h-[460px] sm:min-h-[520px] w-full overflow-hidden">
          <MediaBackdrop
            src={media.backdrop}
            fallbackSrc={media.poster}
            alt={media.title}
          />

          {/* Scrim sólido (CERO gradientes) */}
          <div className="absolute inset-0 bg-black/75" />

          {/* Bloque sólido debajo */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-bg border-t border-line" />

          <div className="relative z-10 flex min-h-[460px] sm:min-h-[520px] items-center">
            <Container className="py-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Poster */}
                <div className="relative h-64 sm:h-80 w-44 sm:w-56 shrink-0 overflow-hidden rounded-sm border border-line shadow-2xl bg-surface">
                  <Image
                    src={media.poster}
                    alt={media.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 176px, 224px"
                    className="object-cover"
                  />
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="sub">{media.type}</Badge>
                    {media.status === 'ongoing' && <Badge variant="accent">EN EMISIÓN</Badge>}
                    {media.rating && (
                      <div className="rounded-sm bg-surface px-2 py-0.5 border border-line">
                        <Rating score={media.rating} />
                      </div>
                    )}
                    {media.year && (
                      <span className="font-mono text-xs font-bold text-muted">{media.year}</span>
                    )}
                    {media.category && (
                      <span className="text-xs uppercase tracking-wider text-muted">
                        • {media.category.name}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink">
                    {media.title}
                  </h1>

                  {media.alternativeTitle && (
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                      {media.alternativeTitle}
                    </p>
                  )}

                  <div className="mt-4">
                    <GenrePills genres={media.genres} />
                  </div>

                  {media.synopsis && (
                    <p className="mt-4 text-xs sm:text-sm text-ink/80 leading-relaxed max-w-2xl line-clamp-4 sm:line-clamp-none">
                      {media.synopsis}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {episodes.length > 0 && (
                      <Link href={`/media/${media.slug}/${episodes[0].number}`} prefetch={true}>
                        <Button variant="primary" size="lg" className="gap-2">
                          <Play className="h-4 w-4 fill-white" strokeWidth={1.5} />
                          <span>VER EPISODIO 1</span>
                        </Button>
                      </Link>
                    )}

                    <WatchlistButton media={media} size="lg" />
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>

      {/* Lista de Episodios */}
      <Container>
        <Section className="space-y-6">
          <div className="border-b border-line pb-3">
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-ink">
              EPISODIOS ({episodes.length})
            </h2>
          </div>

          <EpisodeList
            slug={media.slug}
            episodes={episodes}
            thumbnailUrl={
              media.id > 0
                ? `https://cdn.animeav1.com/thumbnails/${media.id}.jpg`
                : media.backdrop || media.poster
            }
          />
        </Section>

        {/* Relacionados */}
        {relations.length > 0 && (
          <Section className="pt-6">
            <MediaRow title="TÍTULOS RELACIONADOS" items={relations} />
          </Section>
        )}
      </Container>
    </div>
  );
}
