'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { Genre, Category } from '@/lib/upstream/types';

export interface FilterBarProps {
  genres: Genre[];
  categories: Category[];
}

export function FilterBar({ genres, categories }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'popular';
  const currentStatus = searchParams.get('status') || 'all';
  const currentGenre = searchParams.get('genre') || 'all';
  const currentCategory = searchParams.get('category') || 'all';
  const currentYear = searchParams.get('year') || 'all';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    searchParams.has('genre') ||
    searchParams.has('category') ||
    searchParams.has('status') ||
    searchParams.has('sort') ||
    searchParams.has('year');

  const years = Array.from({ length: 15 }, (_, i) => String(2025 - i));

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-line bg-surface p-3 rounded-sm">
      {/* Orden */}
      <div className="w-[150px]">
        <label className="block mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          ORDEN
        </label>
        <Select value={currentSort} onValueChange={(val) => updateParam('sort', val)}>
          <SelectTrigger>
            <SelectValue placeholder="ORDEN" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Más populares</SelectItem>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="rating">Mejor valorados</SelectItem>
            <SelectItem value="title">Título (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Género */}
      <div className="w-[150px]">
        <label className="block mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          GÉNERO
        </label>
        <Select value={currentGenre} onValueChange={(val) => updateParam('genre', val)}>
          <SelectTrigger>
            <SelectValue placeholder="TODOS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los géneros</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g.id || g.slug} value={g.slug}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categoría */}
      <div className="w-[140px]">
        <label className="block mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          CATEGORÍA
        </label>
        <Select value={currentCategory} onValueChange={(val) => updateParam('category', val)}>
          <SelectTrigger>
            <SelectValue placeholder="TODAS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id || c.slug} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estado */}
      <div className="w-[140px]">
        <label className="block mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          ESTADO
        </label>
        <Select value={currentStatus} onValueChange={(val) => updateParam('status', val)}>
          <SelectTrigger>
            <SelectValue placeholder="TODOS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="ongoing">En emisión</SelectItem>
            <SelectItem value="completed">Finalizado</SelectItem>
            <SelectItem value="upcoming">Próximamente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Año */}
      <div className="w-[120px]">
        <label className="block mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          AÑO
        </label>
        <Select value={currentYear} onValueChange={(val) => updateParam('year', val)}>
          <SelectTrigger>
            <SelectValue placeholder="TODOS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <div className="self-end mb-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-10 text-[10px] gap-1.5 text-muted hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>LIMPIAR</span>
          </Button>
        </div>
      )}
    </div>
  );
}
