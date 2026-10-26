import { NextRequest, NextResponse } from 'next/server';
import { UA_DESKTOP } from '@/lib/upstream/constants';

export const runtime = 'nodejs';

function decodeUrl(encoded: string): string {
  try {
    return Buffer.from(encoded, 'base64url').toString('utf-8');
  } catch {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get('u');

  if (!u) {
    return new NextResponse('Missing segment param "u"', { status: 400 });
  }

  let segmentUrl: string;
  try {
    segmentUrl = decodeUrl(u);
  } catch {
    return new NextResponse('Invalid encoded segment URL', { status: 400 });
  }

  try {
    const origin = new URL(segmentUrl).origin;
    const requestHeaders: Record<string, string> = {
      'User-Agent': UA_DESKTOP,
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'video',
      'Referer': `${origin}/`,
      'Accept': '*/*',
    };

    const range = req.headers.get('range');
    if (range) {
      requestHeaders['Range'] = range;
    }

    const upstreamRes = await fetch(segmentUrl, {
      headers: requestHeaders,
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return new NextResponse(`Upstream segment failed with status ${upstreamRes.status}`, {
        status: upstreamRes.status,
      });
    }

    const responseHeaders = new Headers();
    // Upstream incorrectly serves fMP4 as text/html; force correct MIME type
    responseHeaders.set('Content-Type', 'video/mp4');
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    const contentRange = upstreamRes.headers.get('content-range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown segment error';
    return new NextResponse(`Segment proxy error: ${message}`, { status: 502 });
  }
}
