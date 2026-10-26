import { NextRequest, NextResponse } from 'next/server';
import { STREAM_URL, UA_DESKTOP } from '@/lib/upstream/constants';

export const runtime = 'nodejs';

function resolveUrl(relativeOrAbsolute: string, baseUrl: string): string {
  try {
    return new URL(relativeOrAbsolute, baseUrl).toString();
  } catch {
    return relativeOrAbsolute;
  }
}

function encodeSegmentUrl(originalUrl: string): string {
  const b64 = Buffer.from(originalUrl).toString('base64url');
  return `/api/stream/segment?u=${b64}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let targetUrl = rawUrl;
  // Replace Zilla /play/ with /m3u8/ for the real manifest
  if (targetUrl.includes('player.zilla-networks.com/play/')) {
    targetUrl = targetUrl.replace('player.zilla-networks.com/play/', 'player.zilla-networks.com/m3u8/');
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `${STREAM_URL}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
  }

  try {
    const origin = new URL(targetUrl).origin;
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': UA_DESKTOP,
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': `${origin}/`,
        'Accept': '*/*',
      },
    });

    if (!res.ok) {
      return new NextResponse(`Upstream returned ${res.status}`, { status: res.status });
    }

    const manifestText = await res.text();
    const lines = manifestText.split('\n');

    const rewrittenLines = lines.map((line) => {
      const trimmed = line.trim();

      // Check for #EXT-X-MAP:URI="some/init.mp4"
      if (trimmed.startsWith('#EXT-X-MAP:')) {
        return line.replace(/URI="([^"]+)"/, (_, uri) => {
          const absolute = resolveUrl(uri, targetUrl);
          const proxied = encodeSegmentUrl(absolute);
          return `URI="${proxied}"`;
        });
      }

      // Check if line is a comment or directive
      if (trimmed.startsWith('#') || trimmed === '') {
        return line;
      }

      // If line is a sub-playlist (.m3u8)
      if (trimmed.includes('.m3u8') || trimmed.includes('/manifest')) {
        const absolute = resolveUrl(trimmed, targetUrl);
        return `/api/stream/manifest?url=${encodeURIComponent(absolute)}`;
      }

      // Segment URL (e.g. .ts, .m4s, .mp4, or extensionless/hash segment)
      const absoluteSegment = resolveUrl(trimmed, targetUrl);
      return encodeSegmentUrl(absoluteSegment);
    });

    const rewrittenManifest = rewrittenLines.join('\n');

    return new NextResponse(rewrittenManifest, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown manifest error';
    return new NextResponse(`Manifest proxy error: ${message}`, { status: 502 });
  }
}
