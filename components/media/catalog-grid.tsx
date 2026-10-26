'use client';

import * as React from 'react';
import { useInView } from 'react-intersection-observer';
import { MediaCard } from './media-card';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Compass } from 'lucide-react';
import type { NormalizedMedia, CatalogResult } from '@/lib/upstream/types';

export interface CatalogGridProps {
  initialResults: NormalizedMedia[];
  initialPagination: CatalogResult['pagination'];
  queryString: string;
}

export function CatalogGrid({
  initialResults,
  initialPagination,
  queryString,
}: CatalogGridProps) {
  const [items, setItems] = React.useState<NormalizedMedia[]>(initialResults);
  const [page, setPage] = React.useState(initialPagination.page);
  const [hasNext, setHasNext] = React.useState(initialPagination.hasNext);
  const [loading, setLoading] = React.useState(false);

  // Reset when filters/query change
  React.useEffect(() => {
    setItems(initialResults);
    setPage(initialPagination.page);
    setHasNext(initialPagination.hasNext);
  }, [initialResults, initialPagination]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '200px',
  });

  const loadMore = React.useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);

    const nextPage = page + 1;
    try {
      const glue = queryString ? '&' : '';
      const url = `/api/content/catalog?${queryString}${glue}page=${nextPage}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as CatalogResult;
        setItems((prev) => [...prev, ...data.results]);
        setPage(data.pagination.page);
        setHasNext(data.pagination.hasNext);
      }
    } catch {
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNext, page, queryString]);

  React.useEffect(() => {
    if (inView && hasNext && !loading) {
      loadMore();
    }
  }, [inView, hasNext, loading, loadMore]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Compass className="h-10 w-10" strokeWidth={1.5} />}
        title="NO SE ENCONTRARON RESULTADOS"
        description="Prueba a cambiar los filtros seleccionados o a restablecer la búsqueda."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((media, idx) => (
          <MediaCard key={`${media.id}-${idx}`} media={media} />
        ))}
      </div>

      {hasNext && (
        <div ref={ref} className="py-8 flex justify-center items-center">
          {loading && <Spinner size="default" />}
        </div>
      )}
    </div>
  );
}
