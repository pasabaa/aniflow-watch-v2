import pLimit from 'p-limit';
import { BASE_URL, DEFAULT_HEADERS } from './constants';
import { tagFor } from '@/lib/cache/tags';

const limiter = pLimit(3);

export interface FetchDataOptions {
  revalidate?: number;
  tags?: string[];
}

export const fetchData = <T = unknown>(path: string, options?: FetchDataOptions): Promise<T> =>
  limiter(async () => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = path.startsWith('http') ? path : `${BASE_URL}${cleanPath}`;
    const revalidate = options?.revalidate ?? 600;
    const tags = options?.tags ?? [tagFor(path)];

    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(url, {
          headers: DEFAULT_HEADERS,
          next: { revalidate, tags },
        });

        if (!res.ok) {
          throw new Error(`UPSTREAM_HTTP_${res.status}`);
        }

        return (await res.json()) as T;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    }

    throw lastError || new Error(`UPSTREAM_FETCH_FAILED on ${path}`);
  });
