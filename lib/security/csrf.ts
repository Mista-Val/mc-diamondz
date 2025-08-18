import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CSRF token configuration
const CSRF_TOKEN_NAME = 'x-csrf-token';
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-secret-key-here';
const CSRF_TOKEN_LENGTH = 64;

// Generate a new CSRF token
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

// Get the current CSRF token from cookies
export function getCsrfToken(): string | null {
  return cookies().get(CSRF_TOKEN_NAME)?.value || null;
}

// Set a new CSRF token in the response cookies
export function setCsrfToken(response: NextResponse, token: string): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1); // 1 day expiration

  response.cookies.set({
    name: CSRF_TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires,
  });
}

// Verify if the provided token matches the one in cookies
export function verifyCsrfToken(token: string | null): boolean {
  if (!token) return false;
  const storedToken = getCsrfToken();
  return storedToken !== null && token === storedToken;
}

// Middleware to add CSRF protection to API routes
export function withCsrf(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Skip CSRF check for safe methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      return handler(req);
    }

    // Get token from headers
    const token = req.headers.get('x-csrf-token') || 
                 req.nextUrl.searchParams.get('_csrf');

    // Verify token
    if (!verifyCsrfToken(token)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Proceed with the request handler
    return handler(req);
  };
}

// Middleware to ensure CSRF token is set in cookies
export function ensureCsrfToken(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const response = await handler(req);
    
    // Only set CSRF token if it doesn't exist
    if (!getCsrfToken()) {
      const token = generateCsrfToken();
      setCsrfToken(response, token);
    }
    
    return response;
  };
}

// Generate a CSRF token and set it in cookies
export function getCsrfTokenResponse(): NextResponse {
  const response = new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const token = generateCsrfToken();
  setCsrfToken(response, token);
  
  return response;
}
