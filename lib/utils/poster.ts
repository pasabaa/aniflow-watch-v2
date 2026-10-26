import { CDN_URL } from '@/lib/upstream/constants';

/**
 * Resolves poster URL against CDN.
 * Upstream returns null for poster/backdrop, and serves images by ID as:
 * https://cdn.animeav1.com/covers/{id}.jpg
 */
export function resolvePosterUrl(raw?: string | null, slug?: string, id?: number | string): string {
  if (raw && typeof raw === 'string' && raw.trim() !== '' && raw !== '-1' && raw !== 'null') {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    const cleanPath = raw.startsWith('/') ? raw : `/${raw}`;
    return `${CDN_URL}${cleanPath}`;
  }

  const numId = Number(id);
  if (!isNaN(numId) && numId > 0) {
    return `${CDN_URL}/covers/${numId}.jpg`;
  }

  if (slug) {
    return `${CDN_URL}/covers/${slug}.jpg`;
  }

  return '/images/placeholder-poster.svg';
}

/**
 * Resolves backdrop URL against CDN.
 * Upstream serves backdrops as: https://cdn.animeav1.com/backdrops/{id}.jpg
 */
export function resolveBackdropUrl(raw?: string | null, slug?: string, id?: number | string): string | undefined {
  if (raw && typeof raw === 'string' && raw.trim() !== '' && raw !== '-1' && raw !== 'null') {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    const cleanPath = raw.startsWith('/') ? raw : `/${raw}`;
    return `${CDN_URL}${cleanPath}`;
  }

  const numId = Number(id);
  if (!isNaN(numId) && numId > 0) {
    return `${CDN_URL}/backdrops/${numId}.jpg`;
  }

  if (slug) {
    return `${CDN_URL}/backdrops/${slug}.jpg`;
  }

  return undefined;
}
