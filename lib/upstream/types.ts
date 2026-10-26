export interface NormalizedMedia {
  id: number;
  slug: string;
  title: string;
  alternativeTitle?: string;
  synopsis?: string;
  poster: string;        // URL resuelta contra CDN
  backdrop?: string;     // URL resuelta contra CDN
  status: 'ongoing' | 'completed' | 'upcoming';
  type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special';
  year?: number;
  rating?: number;
  genres: { id: number; name: string; slug: string }[];
  category?: { id: number; name: string };
  episodeCount?: number;
  malId?: number;
}

export interface Episode {
  id: number;
  number: number;
  title?: string;
  slug: string;
  variants: Record<'SUB' | 'DUB', boolean>;  // DUB puede no existir
}

export interface EpisodeSource {
  audio: 'SUB' | 'DUB';
  servers: {
    name: string;        // 'HLS' | 'Voe' | 'MP4Upload' | 'UPNShare' | 'Byse'
    url: string;
    type: 'hls' | 'embed';
  }[];
  downloads: { name: string; url: string }[];
}

export interface HomePayload {
  hero: NormalizedMedia[];
  rows: { title: string; items: NormalizedMedia[] }[];
}

export interface CatalogResult {
  results: NormalizedMedia[];
  pagination: { page: number; totalPages: number; hasNext: boolean };
}

export interface MediaDetails {
  media: NormalizedMedia;
  episodes: Episode[];
  relations: NormalizedMedia[];
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  malId?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  malId?: number;
}

// Progress store
export type ProgressMap = Record<string, {
  episodeNumber: number;
  position: number;     // segundos
  duration: number;     // segundos
  title: string;
  poster?: string;
  mediaId?: number;
  thumbnailUrl?: string;
  updatedAt: number;    // timestamp
}>;

// Watchlist store
export type WatchlistMap = Record<string, {
  title: string;
  poster: string;
  addedAt: number;
}>;

// History store
export type HistoryMap = Record<string, number[]>;  // slug → episodios vistos
