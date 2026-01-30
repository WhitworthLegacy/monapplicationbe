import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - allow without authentication
  const publicRoutes = [
    '/login',
    '/',
    '/tarifs',
    '/contact',
    '/mentions-legales',
    '/confidentialite',
  ];

  // API routes that should be public
  const publicApiRoutes = [
    '/api/contact',
    '/api/auth/login',
    '/api/auth/logout',
  ];

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isPublicApi = publicApiRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute || isPublicApi) {
    return NextResponse.next();
  }

  // For admin routes, check authentication
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = new URL(`/login?redirect=${pathname}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)'],
};
