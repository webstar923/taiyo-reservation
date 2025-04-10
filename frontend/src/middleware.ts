import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from '@/utils/cookieUtils';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const accessToken = getCookie('userRole');


  // Redirect root `/` to `/dashboard`
  if (url === '/') {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  if (url.startsWith('/dashboard')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/chat', req.url));
    }
    return NextResponse.next();
  }

  // Skip middleware for specific paths (auth, API, static assets)
  if (
    url.startsWith('/_next/') ||
    url.startsWith('/assets/') ||
    url === '/maintenance' ||
    url.startsWith('/auth/') || // Exclude all auth routes
    url.startsWith('/api/')    // Exclude all API requests
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Exclude auth, API routes, and static assets from middleware execution
export const config = {
  matcher: ['/((?!_next/|assets/|api/|auth/|maintenance).*)'],
};
