'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { FilterBar } from '@/components/media/filter-bar';
import { MediaCard } from '@/components/media/media-card';
import { MOCK_ITEMS, MOCK_GENRES, MOCK_CATEGORIES } from '@/lib/upstream/mock-data';

function CatalogContent() {
  const searchParams = useSearchParams();
  const genre = searchParams.get('genre');
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  const filtered = React.useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      if (genre && genre !== 'all' && !item.genres.some((g) => g.slug === genre)) return false;
      if (category && category !== 'all' && item.category && String(item.category.id) !== category && item.category.name.toLowerCase() !== category.toLowerCase()) return false;
      if (status && status !== 'all' && item.status !== status) return false;
      return true;
    });
  }, [genre, category, status]);

  return (
    <Section className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
          CATÁLOGO
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-muted">
          {filtered.length} TÍTULOS DISPONIBLES
        </p>
      </div>

      <FilterBar genres={MOCK_GENRES} categories={MOCK_CATEGORIES} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map((media) => (
          <MediaCard key={media.id} media={media} />
        ))}
      </div>
    </Section>
  );
}

export default function CatalogPage() {
  return (
    <Container className="py-4">
      <React.Suspense
        fallback={<div className="p-8 text-center text-muted font-mono text-xs">CARGANDO CATÁLOGO...</div>}
      >
        <CatalogContent />
      </React.Suspense>
    </Container>
  );
}
