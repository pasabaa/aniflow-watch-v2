import { NextRequest, NextResponse } from 'next/server';
import { CDN_URL, UA_DESKTOP } from '@/lib/upstream/constants';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let imageUrl = rawUrl;
  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    imageUrl = `${CDN_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  try {
    const origin = new URL(imageUrl).origin;
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': UA_DESKTOP,
        'Referer': `${origin}/`,
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      return new NextResponse(`CDN returned ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown image error';
    return new NextResponse(`Image proxy error: ${message}`, { status: 502 });
  }
}
