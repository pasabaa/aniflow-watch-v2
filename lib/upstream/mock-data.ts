import type { NormalizedMedia, Episode, EpisodeSource, Genre, Category } from './types';

export const MOCK_GENRES: Genre[] = [
  { id: 1, name: 'Acción', slug: 'accion', malId: 1 },
  { id: 2, name: 'Aventura', slug: 'aventura', malId: 2 },
  { id: 4, name: 'Comedia', slug: 'comedia', malId: 4 },
  { id: 8, name: 'Drama', slug: 'drama', malId: 8 },
  { id: 10, name: 'Fantasía', slug: 'fantasia', malId: 10 },
  { id: 22, name: 'Romance', slug: 'romance', malId: 22 },
  { id: 24, name: 'Ciencia Ficción', slug: 'ciencia-ficcion', malId: 24 },
  { id: 30, name: 'Deportes', slug: 'deportes', malId: 30 },
  { id: 36, name: 'Sobrenatural', slug: 'sobrenatural', malId: 36 },
  { id: 37, name: 'Suspense', slug: 'suspense', malId: 37 },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Anime TV', slug: 'tv', malId: 1 },
  { id: 2, name: 'Películas', slug: 'peliculas', malId: 2 },
  { id: 3, name: 'OVAs', slug: 'ova', malId: 3 },
  { id: 4, name: 'Especiales', slug: 'especial', malId: 4 },
];

export const MOCK_ITEMS: NormalizedMedia[] = [
  {
    id: 101,
    slug: 'shingeki-no-kyojin-final-season',
    title: 'Shingeki no Kyojin: The Final Season',
    alternativeTitle: 'Attack on Titan Final Season',
    synopsis:
      'Gabi Braun y Falco Grice han estado entrenando toda su vida para heredar uno de los siete titanes bajo el control de Marley. Sin embargo, su paz se hace añicos con la llegada de Eren Jaeger y los miembros restantes del Cuerpo de Exploración.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    status: 'completed',
    type: 'TV',
    year: 2023,
    rating: 9.1,
    genres: [
      { id: 1, name: 'Acción', slug: 'accion' },
      { id: 8, name: 'Drama', slug: 'drama' },
      { id: 37, name: 'Suspense', slug: 'suspense' },
    ],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 28,
    malId: 40028,
  },
  {
    id: 102,
    slug: 'jujutsu-kaisen-2nd-season',
    title: 'Jujutsu Kaisen 2nd Season',
    alternativeTitle: 'Sorcery Fight Season 2',
    synopsis:
      'El pasado sale a la luz cuando los estudiantes de segundo año Satoru Gojo y Suguru Geto tienen la tarea de escoltar a la doncella del Plasma Estelar al Maestro Tengen.',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    status: 'completed',
    type: 'TV',
    year: 2023,
    rating: 8.9,
    genres: [
      { id: 1, name: 'Acción', slug: 'accion' },
      { id: 10, name: 'Fantasía', slug: 'fantasia' },
      { id: 36, name: 'Sobrenatural', slug: 'sobrenatural' },
    ],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 23,
    malId: 51009,
  },
  {
    id: 103,
    slug: 'sousou-no-frieren',
    title: 'Sousou no Frieren',
    alternativeTitle: 'Frieren: Beyond Journey\'s End',
    synopsis:
      'La maga elfa Frieren y sus valientes compañeros han derrotado al Rey Demonio y han traído la paz a la tierra. Para una elfa casi inmortal, cincuenta años son solo un parpadeo.',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    status: 'completed',
    type: 'TV',
    year: 2024,
    rating: 9.3,
    genres: [
      { id: 2, name: 'Aventura', slug: 'aventura' },
      { id: 8, name: 'Drama', slug: 'drama' },
      { id: 10, name: 'Fantasía', slug: 'fantasia' },
    ],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 28,
    malId: 52991,
  },
  {
    id: 104,
    slug: 'kimetsu-no-yaiba-hashira-geiko-hen',
    title: 'Kimetsu no Yaiba: Hashira Geiko-hen',
    alternativeTitle: 'Demon Slayer: Hashira Training Arc',
    synopsis:
      'Tanjiro va a ver al Hashira de la Piedra, Himejima, quien tiene la intención de prepararlo para las batallas venideras. El entrenamiento para convertirse en un Hashira es riguroso y exigente.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=80',
    status: 'completed',
    type: 'TV',
    year: 2024,
    rating: 8.5,
    genres: [
      { id: 1, name: 'Acción', slug: 'accion' },
      { id: 10, name: 'Fantasía', slug: 'fantasia' },
    ],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 8,
    malId: 55701,
  },
  {
    id: 105,
    slug: 'solo-leveling',
    title: 'Solo Leveling: Ore dake Level Up na Ken',
    alternativeTitle: 'Solo Leveling',
    synopsis:
      'En un mundo donde los cazadores con diversos poderes mágicos luchan contra monstruos mortales, Sung Jinwoo es conocido como el cazador más débil de toda la humanidad.',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&auto=format&fit=crop&q=80',
    status: 'ongoing',
    type: 'TV',
    year: 2024,
    rating: 8.4,
    genres: [
      { id: 1, name: 'Acción', slug: 'accion' },
      { id: 2, name: 'Aventura', slug: 'aventura' },
      { id: 10, name: 'Fantasía', slug: 'fantasia' },
    ],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 12,
    malId: 52299,
  },
  {
    id: 106,
    slug: 'chainsaw-man-movie-reze-hen',
    title: 'Chainsaw Man: Reze-hen',
    alternativeTitle: 'Chainsaw Man - The Movie: Reze Arc',
    synopsis:
      'Denji continúa viviendo su vida como cazador de demonios de la Seguridad Pública. Cuando conoce a una misteriosa chica llamada Reze en un café local, su vida da un giro inesperado.',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    status: 'upcoming',
    type: 'Movie',
    year: 2025,
    rating: 9.0,
    genres: [
      { id: 1, name: 'Acción', slug: 'accion' },
      { id: 36, name: 'Sobrenatural', slug: 'sobrenatural' },
    ],
    category: { id: 2, name: 'Películas' },
    episodeCount: 1,
    malId: 57555,
  },
  {
    id: 107,
    slug: 'vinland-saga-season-2',
    title: 'Vinland Saga Season 2',
    alternativeTitle: 'Vinland Saga',
    synopsis:
      'Un nuevo milenio comienza en la parte sur de la península de Jutlandia en Dinamarca. Thorfin es comprado por el terrateniente Ketil como esclavo y se dedica al trabajo de recuperación de tierras en su granja.',
    poster: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80',
    status: 'completed',
    type: 'TV',
    year: 2023,
    rating: 8.8,
    genres: [
      { id: 1, name: 'Acción', slug: 'accion' },
      { id: 2, name: 'Aventura', slug: 'aventura' },
      { id: 8, name: 'Drama', slug: 'drama' },
    ],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 24,
    malId: 49419,
  },
  {
    id: 108,
    slug: 'bleach-sennen-kessen-hen',
    title: 'Bleach: Sennen Kessen-hen',
    alternativeTitle: 'Bleach: Thousand-Year Blood War',
    synopsis:
      'La Sociedad de Almas es atacada por el Wandenreich, un grupo de Quincy liderado por Yhwach, el progenitor de todos los Quincy.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&auto=format&fit=crop&q=80',
    status: 'ongoing',
    type: 'TV',
    year: 2024,
    rating: 9.0,
    genres: [
      { id: 1, name: 'Acción', slug: 'accion' },
      { id: 2, name: 'Aventura', slug: 'aventura' },
      { id: 36, name: 'Sobrenatural', slug: 'sobrenatural' },
    ],
    category: { id: 1, name: 'Anime TV' },
    episodeCount: 26,
    malId: 41467,
  },
];

export function getMockEpisodes(slug: string, count = 12): Episode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Episodio ${i + 1}`,
    slug: `${slug}-${i + 1}`,
    variants: {
      SUB: true,
      DUB: i % 2 === 0,
    },
  }));
}

export function getMockSources(audio: 'SUB' | 'DUB' = 'SUB'): EpisodeSource {
  return {
    audio,
    servers: [
      {
        name: 'HLS Directo',
        // Reliable multi-bitrate HLS test stream
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        type: 'hls',
      },
      {
        name: 'Voe (Embed)',
        url: 'https://voe.sx/e/demo12345',
        type: 'embed',
      },
      {
        name: 'MP4Upload (Embed)',
        url: 'https://www.mp4upload.com/embed-demo123.html',
        type: 'embed',
      },
      {
        name: 'UPNShare (Embed)',
        url: 'https://upnshare.com/embed/demo',
        type: 'embed',
      },
      {
        name: 'Byse (Embed)',
        url: 'https://byse.to/embed/demo',
        type: 'embed',
      },
    ],
    downloads: [
      { name: '1080p fMP4', url: 'https://test-streams.mux.dev/x36xhzz/url_0/url_460/1920x1080.mp4' },
      { name: '720p fMP4', url: 'https://test-streams.mux.dev/x36xhzz/url_0/url_461/1280x720.mp4' },
    ],
  };
}
