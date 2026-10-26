import { resolvePosterUrl, resolveBackdropUrl } from '@/lib/utils/poster';
import type { NormalizedMedia, Episode, EpisodeSource, Genre, Category } from './types';

/**
 * Normalizes values where -1 or '-1' or null indicates undefined in devalue/SvelteKit payloads.
 */
function cleanValue<T>(val: T): T | undefined {
  if (val === -1 || val === '-1' || val === null || val === undefined) {
    return undefined;
  }
  return val;
}

/**
 * Normalizes numeric IDs that might arrive as string or number.
 */
function cleanNumber(val: unknown): number | undefined {
  if (val === -1 || val === '-1' || val === null || val === undefined || val === '') {
    return undefined;
  }
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

/**
 * Normalizes malId which can arrive as string ("Movie" / "123") or number.
 */
function cleanMalId(val: unknown): number | undefined {
  if (val === -1 || val === '-1' || val === null || val === undefined || val === '') {
    return undefined;
  }
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

/**
 * Maps upstream status string or numbers to standard status.
 */
function normalizeStatus(val: unknown): 'ongoing' | 'completed' | 'upcoming' {
  if (val === 1 || val === 'ongoing' || val === 'En emisión' || val === 'airing') {
    return 'ongoing';
  }
  if (val === 2 || val === 'completed' || val === 'Finalizado' || val === 'finished') {
    return 'completed';
  }
  if (val === 3 || val === 'upcoming' || val === 'Próximamente') {
    return 'upcoming';
  }
  return 'completed';
}

/**
 * Maps upstream type to 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special'.
 */
function normalizeType(val: unknown): 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' {
  const str = String(val || '').toUpperCase();
  if (str.includes('MOVIE') || str.includes('PEL')) return 'Movie';
  if (str.includes('OVA')) return 'OVA';
  if (str.includes('ONA')) return 'ONA';
  if (str.includes('SPECIAL') || str.includes('ESPECIAL')) return 'Special';
  return 'TV';
}

/**
 * Normalizes a raw media object from upstream.
 */
export function normalizeMedia(
  raw: any,
  categoriesMap?: Record<number, { id: number; name: string }>
): NormalizedMedia {
  if (!raw || typeof raw !== 'object') {
    return {
      id: 0,
      slug: 'unknown',
      title: 'Sin título',
      poster: resolvePosterUrl(undefined, 'unknown'),
      status: 'completed',
      type: 'TV',
      genres: [],
    };
  }

  const id = cleanNumber(raw.id) ?? 0;
  const slug = String(cleanValue(raw.slug) || cleanValue(raw.name) || `media-${id}`);
  const title = String(cleanValue(raw.title) || cleanValue(raw.name) || slug);
  const alternativeTitle = cleanValue(raw.alternativeTitle || raw.alternative_title || raw.other_title);
  const synopsis = cleanValue(raw.synopsis || raw.description || raw.overview);

  // Poster and backdrop resolution against CDN (uses anime ID)
  const rawPoster = cleanValue(raw.poster || raw.cover || raw.image_url || raw.poster_url);
  const poster = resolvePosterUrl(rawPoster, slug, id);

  const rawBackdrop = cleanValue(raw.backdrop || raw.banner || raw.backdrop_url);
  const backdrop = resolveBackdropUrl(rawBackdrop, slug, id);

  const status = normalizeStatus(raw.status);
  const type = normalizeType(raw.type || raw.category_type || raw.category?.name);

  const year = cleanNumber(raw.year || raw.release_year) || (raw.startDate ? new Date(raw.startDate).getFullYear() : (raw.date ? new Date(raw.date).getFullYear() : undefined));
  const rating = cleanNumber(raw.rating || raw.score || raw.average_score);
  const episodeCount = cleanNumber(raw.episodeCount || raw.episode_count || raw.episodes_count || raw.total_episodes);
  const malId = cleanMalId(raw.malId || raw.mal_id);

  // Normalizing genres
  let genres: { id: number; name: string; slug: string }[] = [];
  if (Array.isArray(raw.genres)) {
    genres = raw.genres
      .map((g: any) => {
        if (!g) return null;
        if (typeof g === 'string') {
          return { id: 0, name: g, slug: g.toLowerCase().replace(/\s+/g, '-') };
        }
        const gId = cleanNumber(g.id) ?? 0;
        const gName = String(cleanValue(g.name) || cleanValue(g.title) || 'Género');
        const gSlug = String(cleanValue(g.slug) || gName.toLowerCase().replace(/\s+/g, '-'));
        return { id: gId, name: gName, slug: gSlug };
      })
      .filter((g: any): g is { id: number; name: string; slug: string } => g !== null);
  }

  // Category normalization
  let category: { id: number; name: string } | undefined;
  const catId = cleanNumber(raw.categoryId || raw.category_id);
  if (catId !== undefined && categoriesMap && categoriesMap[catId]) {
    category = categoriesMap[catId];
  } else if (raw.category && typeof raw.category === 'object') {
    const cid = cleanNumber(raw.category.id) ?? (catId || 0);
    category = {
      id: cid,
      name: String(cleanValue(raw.category.name) || 'General'),
    };
  } else if (catId !== undefined) {
    category = { id: catId, name: `Categoría ${catId}` };
  }

  return {
    id,
    slug,
    title,
    alternativeTitle: alternativeTitle ? String(alternativeTitle) : undefined,
    synopsis: synopsis ? String(synopsis) : undefined,
    poster,
    backdrop,
    status,
    type,
    year,
    rating,
    genres,
    category,
    episodeCount,
    malId,
  };
}

/**
 * Normalizes an episode item.
 * Trap: variants can lack DUB, never assume it exists.
 */
export function normalizeEpisode(raw: any, fallbackSlug?: string): Episode {
  const id = cleanNumber(raw?.id) ?? 0;
  const number = cleanNumber(raw?.number || raw?.episode_number || raw?.ep) ?? 1;
  const slug = String(cleanValue(raw?.slug) || `${fallbackSlug || 'media'}-${number}`);
  const title = cleanValue(raw?.title) ? String(raw.title) : undefined;

  // Variants handling
  const rawVariants = raw?.variants || {};
  const hasSub = rawVariants.SUB === true || rawVariants.sub === true || raw?.has_sub !== false;
  const hasDub = rawVariants.DUB === true || rawVariants.dub === true || raw?.has_dub === true;

  return {
    id,
    number,
    title,
    slug,
    variants: {
      SUB: hasSub,
      DUB: hasDub,
    },
  };
}

/**
 * Normalizes episode sources (HLS, embed servers, downloads).
 */
export function normalizeSources(raw: any, audio: 'SUB' | 'DUB' = 'SUB'): EpisodeSource {
  const servers: EpisodeSource['servers'] = [];
  const downloads: EpisodeSource['downloads'] = [];

  // Upstream embeds structure: raw.embeds: { SUB: [...], DUB: [...] }
  let rawServers: any[] = [];
  if (raw?.embeds && typeof raw.embeds === 'object' && !Array.isArray(raw.embeds)) {
    rawServers = raw.embeds[audio] || raw.embeds.SUB || raw.embeds.DUB || [];
  } else if (Array.isArray(raw?.servers)) {
    rawServers = raw.servers;
  } else if (Array.isArray(raw)) {
    rawServers = raw;
  }

  for (const s of rawServers) {
    if (!s || !s.url) continue;
    const name = String(s.server || s.name || s.title || 'Servidor');
    let url = String(s.url);

    // CRITICAL: Replace /play/ with /m3u8/ for player.zilla-networks.com
    if (url.includes('player.zilla-networks.com/play/')) {
      url = url.replace('player.zilla-networks.com/play/', 'player.zilla-networks.com/m3u8/');
    }

    const isHls =
      name.toUpperCase() === 'HLS' ||
      url.includes('.m3u8') ||
      url.includes('/m3u8/') ||
      url.includes('player.zilla-networks.com') ||
      name.toLowerCase().includes('directo');

    servers.push({
      name,
      url,
      type: isHls ? 'hls' : 'embed',
    });
  }

  // Sort: HLS servers first, embeds second
  servers.sort((a, b) => {
    if (a.type === 'hls' && b.type !== 'hls') return -1;
    if (a.type !== 'hls' && b.type === 'hls') return 1;
    return 0;
  });

  // Upstream downloads structure: raw.downloads: { SUB: [...], DUB: [...] }
  let rawDownloads: any[] = [];
  if (raw?.downloads && typeof raw.downloads === 'object' && !Array.isArray(raw.downloads)) {
    rawDownloads = raw.downloads[audio] || raw.downloads.SUB || raw.downloads.DUB || [];
  } else if (Array.isArray(raw?.downloads)) {
    rawDownloads = raw.downloads;
  }

  for (const d of rawDownloads) {
    if (!d || !d.url) continue;
    downloads.push({
      name: String(d.server || d.name || 'Descarga'),
      url: String(d.url),
    });
  }

  return {
    audio,
    servers,
    downloads,
  };
}

/**
 * Normalizes genres with malId number | undefined.
 */
export function normalizeGenre(raw: any): Genre {
  const id = cleanNumber(raw?.id) ?? 0;
  const name = String(cleanValue(raw?.name) || cleanValue(raw?.title) || 'Género');
  const slug = String(cleanValue(raw?.slug) || name.toLowerCase().replace(/\s+/g, '-'));
  const malId = cleanMalId(raw?.malId || raw?.mal_id);

  return {
    id,
    name,
    slug,
    malId,
  };
}

/**
 * Normalizes categories.
 */
export function normalizeCategory(raw: any): Category {
  const id = cleanNumber(raw?.id) ?? 0;
  const name = String(cleanValue(raw?.name) || cleanValue(raw?.title) || 'Categoría');
  const slug = String(cleanValue(raw?.slug) || name.toLowerCase().replace(/\s+/g, '-'));
  const malId = cleanMalId(raw?.malId || raw?.mal_id);

  return {
    id,
    name,
    slug,
    malId,
  };
}
