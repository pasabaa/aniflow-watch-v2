'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { MediaCard } from '@/components/media/media-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import { MOCK_ITEMS } from '@/lib/upstream/mock-data';
import type { NormalizedMedia } from '@/lib/upstream/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = React.useState<NormalizedMedia[]>([]);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults(MOCK_ITEMS.slice(0, 8));
      return;
    }
    const filtered = MOCK_ITEMS.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  return (
    <Section className="space-y-6">
      <div className="border-b border-line pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
          {query ? `RESULTADOS PARA: "${query}"` : 'BÚSQUEDA'}
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-muted">
          {results.length} TÍTULOS ENCONTRADOS
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<Search className="h-10 w-10" strokeWidth={1.5} />}
          title="NO SE ENCONTRARON RESULTADOS"
          description={`No encontramos ningún título que coincida con "${query}". Intenta buscar con otro término.`}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {results.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      )}
    </Section>
  );
}

export default function SearchPage() {
  return (
    <Container className="py-4">
      <React.Suspense
        fallback={<div className="p-8 text-center text-muted font-mono text-xs">CARGANDO BÚSQUEDA...</div>}
      >
        <SearchContent />
      </React.Suspense>
    </Container>
  );
}
