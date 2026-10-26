'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Poster } from '@/components/ui/poster';
import { useWatchlistStore } from '@/store/watchlist';
import { useHydrated } from '@/store/hydration';
import { formatRelativeDate } from '@/lib/utils/format';

export default function WatchlistPage() {
  const hydrated = useHydrated();
  const watchlistMap = useWatchlistStore((s) => s.items);
  const removeItem = useWatchlistStore((s) => s.removeItem);

  if (!hydrated) {
    return (
      <Container>
        <Section className="space-y-6">
          <div className="border-b border-line pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
              MI LISTA
            </h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-line rounded-sm" />
            ))}
          </div>
        </Section>
      </Container>
    );
  }

  const items = Object.entries(watchlistMap).sort((a, b) => b[1].addedAt - a[1].addedAt);

  return (
    <Container>
      <Section className="space-y-6">
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
              MI LISTA
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted">
              {items.length} TÍTULOS GUARDADOS
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-10 w-10" strokeWidth={1.5} />}
            title="TU LISTA ESTÁ VACÍA"
            description="Guarda series y películas haciendo clic en 'MI LISTA' para acceder rápidamente a ellas aquí."
            action={
              <Link href="/catalogo">
                <Button variant="primary">EXPLORAR CATÁLOGO</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map(([slug, item]) => (
              <div
                key={slug}
                className="group relative flex flex-col rounded-sm border border-line bg-surface p-2 transition-colors hover:border-neutral-700"
              >
                <Link href={`/media/${slug}`} prefetch={true} className="block mb-2">
                  <Poster src={item.poster} alt={item.title} />
                </Link>

                <div className="flex-1 flex flex-col justify-between px-1">
                  <div>
                    <Link href={`/media/${slug}`} prefetch={true}>
                      <h3 className="truncate text-xs font-bold uppercase tracking-wider text-ink transition-colors group-hover:text-white">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-[10px] text-muted font-mono uppercase">
                      Añadido {formatRelativeDate(item.addedAt)}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-line flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(slug)}
                      className="text-muted hover:text-accent transition-colors p-1 cursor-pointer"
                      title="Eliminar de mi lista"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </Container>
  );
}
