export const BASE_URL = (process.env.UPSTREAM_API_URL || 'https://animeav1.com').replace(/\/+$/, '');
export const CDN_URL = (process.env.UPSTREAM_CDN_URL || 'https://cdn.animeav1.com').replace(/\/+$/, '');
export const STREAM_URL = (process.env.UPSTREAM_STREAM_URL || 'https://player.zilla-networks.com').replace(/\/+$/, '');

export const UA_DESKTOP =
  process.env.UPSTREAM_USER_AGENT ||
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';

export const DEFAULT_HEADERS = {
  'User-Agent': UA_DESKTOP,
  'Accept': 'application/json, text/plain, */*',
  'Referer': `${BASE_URL}/`,
};

export const TTLS = {
  HOME: 600,
  CATALOG: 300,
  INFO: 600,
  SOURCES: 180,
  GENRES: 3600,
  CATEGORIES: 3600,
} as const;
