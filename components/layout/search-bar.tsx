'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Poster } from '@/components/ui/poster';
import { Rating } from '@/components/ui/rating';
import type { NormalizedMedia, CatalogResult } from '@/lib/upstream/types';

export interface SearchBarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchBarDialog({ open, onOpenChange }: SearchBarDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/content/catalog?q=${encodeURIComponent(query)}&page=1`);
        if (res.ok) {
          const data = (await res.json()) as CatalogResult;
          setResults(data.results.slice(0, 6));
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    setQuery('');
    router.push(`/media/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onOpenChange(false);
      router.push(`/busqueda?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Buscador</DialogTitle>
        <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-line px-4">
          <Search className="h-5 w-5 text-muted shrink-0 mr-3" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="BUSCAR ANIME, PELÍCULA O GÉNERO..."
            className="w-full bg-transparent py-4 text-xs font-bold uppercase tracking-wider text-ink placeholder:text-muted/60 focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="h-4 w-4 text-muted animate-spin shrink-0" strokeWidth={1.5} />}
        </form>

        <div className="max-h-[380px] overflow-y-auto p-2">
          {query.trim() && !loading && results.length === 0 && (
            <div className="py-12 text-center text-xs uppercase tracking-widest text-muted">
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.slug)}
                  className="flex items-center gap-3 p-2 rounded-sm hover:bg-line transition-colors cursor-pointer group"
                >
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm border border-line">
                    <Poster src={item.poster} alt={item.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink truncate group-hover:text-white">
                      {item.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted uppercase">
                      <span>{item.type}</span>
                      {item.year && <span>• {item.year}</span>}
                      {item.rating && (
                        <span>
                          • <Rating score={item.rating} size="sm" className="inline-flex" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div className="py-8 text-center text-xs uppercase tracking-widest text-muted">
              Escribe para buscar o presiona ESC para cerrar
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
