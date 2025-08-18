import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { verifyCsrfToken } from '@/lib/security/csrf';

// List of paths that require CSRF protection
const CSRF_PROTECTED_PATHS = [
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/profile',
  '/api/auth/verify-email',
];

// List of public paths that don't require authentication
const PUBLIC_PATHS = [
  '/auth/signin',
  '/auth/error',
  '/auth/verify-email',
  '/auth/reset-password',
  '/api/auth/signin',
  '/api/auth/csrf',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
];

// Check if the path requires CSRF protection
function requiresCsrfProtection(pathname: string): boolean {
  return CSRF_PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

// Check if the path is public
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  
  // Handle CSRF protection for protected API routes
  if (requiresCsrfProtection(pathname)) {
    // Skip CSRF check for GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
      const csrfToken = request.headers.get('x-csrf-token') || 
                       new URL(request.url).searchParams.get('_csrf');
      
      if (!verifyCsrfToken(csrfToken)) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid CSRF token' }), 
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // Handle authentication for protected routes
  if (!isPublicPath(pathname) && !session) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // For authenticated users trying to access auth pages, redirect to home
  if (session && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
