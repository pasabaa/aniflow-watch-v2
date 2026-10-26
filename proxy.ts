import { NextResponse, type NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect streaming proxy routes from external unauthorized hotlinking
  if (pathname.startsWith('/api/stream') || pathname.startsWith('/api/proxy')) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    const secFetchSite = req.headers.get('sec-fetch-site');

    // If request comes cross-site without being from the same host
    if (secFetchSite === 'cross-site' && origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          // Allow in dev mode or check permitted domains
          if (process.env.NODE_ENV === 'production' && !originUrl.host.includes('localhost')) {
            return new NextResponse('Unauthorized cross-site origin', { status: 403 });
          }
        }
      } catch {
        return new NextResponse('Malformed origin', { status: 400 });
      }
    }

    const response = NextResponse.next();
    response.headers.set('X-Flow-Proxy', 'active');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/stream/:path*', '/api/proxy/:path*'],
};
