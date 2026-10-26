import { fetchData } from './client';
import { decodeNodes } from './decode';
import { normalizeMedia, normalizeEpisode, normalizeSources, normalizeGenre, normalizeCategory } from './normalize';
import { MOCK_ITEMS, MOCK_GENRES, MOCK_CATEGORIES, getMockEpisodes, getMockSources } from './mock-data';
import type {
  HomePayload,
  CatalogResult,
  MediaDetails,
  EpisodeSource,
  Genre,
  Category,
  NormalizedMedia,
  Episode,
} from './types';

export async function getHomeData(): Promise<HomePayload> {
  try {
    const raw = await fetchData<unknown>('/__data.json', { revalidate: 600 });
    const decoded = decodeNodes<any>(raw);

    if (
      decoded &&
      (decoded.featured || decoded.latestMedia || decoded.latestEpisodes || decoded.hero || decoded.rows)
    ) {
      // 1. Hero items from featured
      const rawFeatured = Array.isArray(decoded.featured)
        ? decoded.featured
        : Array.isArray(decoded.hero)
          ? decoded.hero
          : [];
      const hero = rawFeatured.map((item: any) => normalizeMedia(item));

      // 2. Rows
      const rows: { title: string; items: NormalizedMedia[] }[] = [];

      // Row 1: Últimos episodios emitidos
      if (Array.isArray(decoded.latestEpisodes) && decoded.latestEpisodes.length > 0) {
        const seenSlugs = new Set<string>();
        const latestEpMedia: NormalizedMedia[] = [];

        for (const ep of decoded.latestEpisodes) {
          if (!ep) continue;
          const mediaObj = ep.media || ep;
          const slug = mediaObj.slug || `media-${mediaObj.id}`;
          if (seenSlugs.has(slug)) continue;
          seenSlugs.add(slug);

          latestEpMedia.push(
            normalizeMedia({
              ...mediaObj,
              episodeCount: ep.number,
            })
          );
        }

        if (latestEpMedia.length > 0) {
          rows.push({
            title: 'ÚLTIMOS EPISODIOS',
            items: latestEpMedia,
          });
        }
      }

      // Row 2: Novedades y tendencias del catálogo
      if (Array.isArray(decoded.latestMedia) && decoded.latestMedia.length > 0) {
        const latestMediaNormalized = decoded.latestMedia.map((item: any) => normalizeMedia(item));
        rows.push({
          title: 'TENDENCIAS Y NOVEDADES',
          items: latestMediaNormalized,
        });

        // Row 3: Películas y Especiales
        const specials = latestMediaNormalized.filter(
          (m: NormalizedMedia) =>
            m.type === 'Special' || m.type === 'OVA' || m.type === 'Movie' || m.type === 'ONA'
        );
        if (specials.length >= 3) {
          rows.push({
            title: 'PELÍCULAS Y ESPECIALES',
            items: specials,
          });
        }

        // Row 4: Series TV
        const tvSeries = latestMediaNormalized.filter((m: NormalizedMedia) => m.type === 'TV');
        if (tvSeries.length >= 3) {
          rows.push({
            title: 'SERIES DESTACADAS',
            items: tvSeries,
          });
        }
      }

      // Fallback custom rows if rows were provided directly
      if (Array.isArray(decoded.rows)) {
        for (const row of decoded.rows) {
          if (row && Array.isArray(row.items)) {
            rows.push({
              title: row.title || 'Destacados',
              items: row.items.map((item: any) => normalizeMedia(item)),
            });
          }
        }
      }

      if (hero.length > 0 || rows.length > 0) {
        return {
          hero: hero.length > 0 ? hero : (rows[0]?.items.slice(0, 4) || MOCK_ITEMS.slice(0, 4)),
          rows:
            rows.length > 0
              ? rows
              : [
                  { title: 'TENDENCIAS', items: MOCK_ITEMS },
                  { title: 'POPULARES', items: [...MOCK_ITEMS].reverse() },
                ],
        };
      }
    }
  } catch {
    // Fallback
  }

  return {
    hero: MOCK_ITEMS.slice(0, 4),
    rows: [
      { title: 'TENDENCIAS', items: MOCK_ITEMS },
      { title: 'POPULARES', items: [...MOCK_ITEMS].reverse() },
      { title: 'ACCIÓN Y AVENTURA', items: MOCK_ITEMS.filter((i) => i.genres.some((g) => g.slug === 'accion')) },
      { title: 'FANTASÍA ÉPICA', items: MOCK_ITEMS.filter((i) => i.genres.some((g) => g.slug === 'fantasia')) },
    ],
  };
}

export async function getCatalogData(params: {
  page?: number;
  q?: string;
  genre?: string;
  category?: string;
  status?: string;
  sort?: string;
  year?: number;
}): Promise<CatalogResult> {
  const page = Math.max(1, params.page || 1);
  const { q = '', genre, category, status = 'all', sort = 'popular', year } = params;

  try {
    const upstreamUrl = `/catalogo/__data.json?page=${page}${genre ? `&genre=${genre}` : ''}${category ? `&category=${category}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
    const raw = await fetchData<unknown>(upstreamUrl, { revalidate: 300 });
    const decoded = decodeNodes<any>(raw);

    if (decoded && (Array.isArray(decoded.results) || Array.isArray(decoded.items))) {
      const itemsRaw = decoded.results || decoded.items;
      const results: NormalizedMedia[] = itemsRaw.map((item: any) => normalizeMedia(item));
      const totalPages = Number(decoded.totalPages || decoded.pagination?.totalPages || Math.ceil(results.length / 24) || 1);
      const hasNext = page < totalPages;

      return {
        results,
        pagination: { page, totalPages, hasNext },
      };
    }
  } catch {
    // Fallback
  }

  let filtered = [...MOCK_ITEMS];

  if (q.trim()) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.alternativeTitle?.toLowerCase().includes(query) ||
        item.synopsis?.toLowerCase().includes(query)
    );
  }

  if (genre && genre !== 'all') {
    filtered = filtered.filter((item) => item.genres.some((g) => g.slug === genre || String(g.id) === genre));
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(
      (item) => String(item.category?.id) === category || item.category?.name.toLowerCase() === category.toLowerCase()
    );
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((item) => item.status === status);
  }

  if (year) {
    filtered = filtered.filter((item) => item.year === year);
  }

  if (sort === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'recent') {
    filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else {
    filtered.sort((a, b) => b.id - a.id);
  }

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const results = filtered.slice(startIndex, startIndex + pageSize);

  return {
    results,
    pagination: {
      page,
      totalPages,
      hasNext: page < totalPages,
    },
  };
}

export async function getInfoData(slug: string): Promise<MediaDetails> {
  try {
    const raw = await fetchData<unknown>(`/media/${slug}/__data.json`, { revalidate: 600 });
    const decoded = decodeNodes<any>(raw);

    if (decoded && (decoded.media || decoded.anime || decoded.item)) {
      const mediaRaw = decoded.media || decoded.anime || decoded.item;
      const media = normalizeMedia(mediaRaw);

      let episodes: Episode[] = [];
      const epsRaw = decoded.episodes || mediaRaw.episodes || [];
      if (Array.isArray(epsRaw)) {
        episodes = epsRaw.map((ep: any) => normalizeEpisode(ep, slug));
      }

      let relations: NormalizedMedia[] = [];
      const relsRaw = decoded.relations || mediaRaw.relations || [];
      if (Array.isArray(relsRaw)) {
        relations = relsRaw
          .map((rel: any) => {
            const target = rel?.destination || rel?.media || rel;
            return normalizeMedia(target);
          })
          .filter((r) => r.id > 0);
      }

      return {
        media,
        episodes: episodes.length > 0 ? episodes : (media.episodeCount ? getMockEpisodes(slug, media.episodeCount) : []),
        relations,
      };
    }
  } catch {
    // Fallback
  }

  const found = MOCK_ITEMS.find((i) => i.slug === slug);
  const media = found || {
    id: 999,
    slug,
    title: slug.replace(/-/g, ' ').toUpperCase(),
    synopsis: 'Sinopsis detallada disponible próximamente en Flow.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    status: 'completed' as const,
    type: 'TV' as const,
    year: 2024,
    rating: 8.5,
    genres: [{ id: 1, name: 'Acción', slug: 'accion' }],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 12,
  };

  return {
    media,
    episodes: getMockEpisodes(slug, media.episodeCount || 12),
    relations: [],
  };
}

export async function getSourcesData(
  slug: string,
  number: number | string,
  audio: 'SUB' | 'DUB' = 'SUB'
): Promise<EpisodeSource> {
  try {
    const raw = await fetchData<unknown>(`/media/${slug}/${number}/__data.json`, { revalidate: 180 });
    const decoded = decodeNodes<any>(raw);

    if (decoded && (decoded.embeds || decoded.servers || decoded.sources)) {
      const sources = normalizeSources(decoded, audio);
      if (sources.servers.length > 0) {
        return sources;
      }
    }
  } catch {
    // Fallback
  }

  return getMockSources(audio);
}

export async function getGenresData(): Promise<Genre[]> {
  try {
    const raw = await fetchData<unknown>('/genres', { revalidate: 3600 });
    const decoded = decodeNodes<unknown>(raw);
    const list = Array.isArray(decoded)
      ? decoded
      : Array.isArray((decoded as any)?.genres)
        ? (decoded as any).genres
        : [];

    if (list.length > 0) {
      return list.map(normalizeGenre);
    }
  } catch {
    // Fallback
  }

  return MOCK_GENRES;
}

export async function getCategoriesData(): Promise<Category[]> {
  try {
    const raw = await fetchData<unknown>('/categories', { revalidate: 3600 });
    const decoded = decodeNodes<unknown>(raw);
    const list = Array.isArray(decoded)
      ? decoded
      : Array.isArray((decoded as any)?.categories)
        ? (decoded as any).categories
        : [];

    if (list.length > 0) {
      return list.map(normalizeCategory);
    }
  } catch {
    // Fallback
  }

  return MOCK_CATEGORIES;
}
