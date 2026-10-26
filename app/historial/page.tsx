'use client';

import * as React from 'react';
import Link from 'next/link';
import { Clock, Trash2, Play } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useProgressStore } from '@/store/progress';
import { useHydrated } from '@/store/hydration';
import { formatTimecode } from '@/lib/utils/format';

export default function HistoryPage() {
  const hydrated = useHydrated();
  const historyMap = useProgressStore((s) => s.history);
  const progressMap = useProgressStore((s) => s.progress);
  const clearHistory = useProgressStore((s) => s.clearHistory);

  if (!hydrated) {
    return (
      <Container>
        <Section className="space-y-6">
          <div className="border-b border-line pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
              HISTORIAL DE REPRODUCCIÓN
            </h1>
          </div>
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-line rounded-sm" />
            ))}
          </div>
        </Section>
      </Container>
    );
  }

  const entries = Object.entries(historyMap).filter(([_, eps]) => eps && eps.length > 0);

  return (
    <Container>
      <Section className="space-y-6">
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
              HISTORIAL DE REPRODUCCIÓN
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted">
              {entries.length} SERIES CON EPISODIOS VISTOS
            </p>
          </div>

          {entries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearHistory()}
              className="text-xs text-muted hover:text-accent gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>BORRAR HISTORIAL</span>
            </Button>
          )}
        </div>

        {entries.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-10 w-10" strokeWidth={1.5} />}
            title="NO HAY HISTORIAL"
            description="Aquí aparecerán los episodios que vayas reproduciendo en Flow."
            action={
              <Link href="/catalogo">
                <Button variant="primary">EXPLORAR CATÁLOGO</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {entries.map(([slug, watchedEpisodes]) => {
              const currentProgress = progressMap[slug];
              const title = currentProgress?.title || slug.replace(/-/g, ' ').toUpperCase();
              const sortedEpisodes = [...watchedEpisodes].sort((a, b) => b - a);
              const lastEp = sortedEpisodes[0];

              return (
                <div
                  key={slug}
                  className="rounded-sm border border-line bg-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/media/${slug}`}
                      className="text-sm font-extrabold uppercase tracking-wider text-ink hover:text-white transition-colors"
                    >
                      {title}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {sortedEpisodes.map((epNum) => (
                        <Link
                          key={epNum}
                          href={`/media/${slug}/${epNum}`}
                          className="px-2 py-0.5 text-[10px] font-mono font-bold bg-line text-ink rounded-none hover:bg-neutral-600 transition-colors"
                        >
                          EP. {epNum}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {currentProgress && currentProgress.duration > 0 && (
                      <span className="font-mono text-xs text-muted">
                        Último visto: {formatTimecode(currentProgress.position)}
                      </span>
                    )}

                    <Link href={`/media/${slug}/${lastEp}`}>
                      <Button variant="secondary" size="sm" className="gap-1.5">
                        <Play className="h-3.5 w-3.5 fill-ink" strokeWidth={1.5} />
                        <span>REPRODUCIR</span>
                      </Button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => clearHistory(slug)}
                      className="text-muted hover:text-accent transition-colors p-1.5 cursor-pointer"
                      title="Eliminar del historial"
                      aria-label="Eliminar del historial"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </Container>
  );
}
