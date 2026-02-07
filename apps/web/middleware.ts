import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block /en/blog and /en/blog/* — blog is FR/NL only
  if (/^\/(en)\/blog(\/.*)?$/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace('/en/blog', '/fr/blog');
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
