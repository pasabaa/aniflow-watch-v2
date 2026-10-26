import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCatalogData, getGenresData } from '@/lib/upstream/loaders';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { GenrePills } from '@/components/media/genre-pills';
import { MediaCard } from '@/components/media/media-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Compass } from 'lucide-react';

export interface GenrePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const genres = [
    'accion',
    'aventura',
    'comedia',
    'drama',
    'fantasia',
    'sobrenatural',
    'shounen',
    'romance',
    'sci-fi',
    'misterio',
  ];
  return genres.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genres = await getGenresData();
  const current = genres.find((g) => g.slug === slug);
  const name = current ? current.name : slug.toUpperCase();

  return {
    title: `Género: ${name}`,
    description: `Explora todo el anime de género ${name} en Flow.`,
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { slug } = await params;
  const [genres, data] = await Promise.all([
    getGenresData(),
    getCatalogData({ genre: slug, page: 1 }),
  ]);

  const currentGenre = genres.find((g) => g.slug === slug);
  const title = currentGenre ? currentGenre.name : slug.toUpperCase();

  return (
    <Container>
      <Section className="space-y-6">
        <div className="border-b border-line pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
            GÉNERO: {title}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted">
            {data.results.length} TÍTULOS ENCONTRADOS
          </p>
        </div>

        {/* Géneros disponibles */}
        <div className="py-2">
          <GenrePills genres={genres} activeSlug={slug} />
        </div>

        {data.results.length === 0 ? (
          <EmptyState
            icon={<Compass className="h-10 w-10" strokeWidth={1.5} />}
            title="NO SE ENCONTRARON TÍTULOS"
            description={`No hay títulos disponibles actualmente en el género ${title}.`}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.results.map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        )}
      </Section>
    </Container>
  );
}
