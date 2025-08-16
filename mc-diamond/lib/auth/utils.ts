import { getServerSession } from 'next-auth/next';
import { authOptions } from './options';
import { UserRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

// Type for authenticated user session
type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
};

export type AuthSession = {
  user: SessionUser;
  accessToken?: string;
  expires: string;
};

/**
 * Get the current user session on the server side
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as SessionUser | null;
}

/**
 * Check if the current user has the required role
 * @param requiredRole The required role to check against
 * @returns Boolean indicating if the user has the required role
 */
export async function hasRole(requiredRole: UserRole) {
  const user = await getCurrentUser();
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === UserRole.ADMIN) return true;
  
  // Check if user has the required role
  return user.role === requiredRole;
}

/**
 * Middleware to protect API routes
 * @param roles Array of allowed roles (default: [UserRole.USER])
 * @returns Middleware function
 */
export function protect(roles: UserRole[] = [UserRole.USER]) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userRole = (session.user as SessionUser).role;
    
    // Admin has access to everything
    if (userRole === UserRole.ADMIN) {
      return next();
    }
    
    // Check if user has one of the required roles
    if (roles.length > 0 && !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    return next();
  };
}

/**
 * Server-side authentication check for Next.js 13+ app directory
 */
export async function checkAuth(roles: UserRole[] = [UserRole.USER]) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { authorized: false, user: null };
  }
  
  const user = session.user as SessionUser;
  
  // Admin has access to everything
  if (user.role === UserRole.ADMIN) {
    return { authorized: true, user };
  }
  
  // Check if user has one of the required roles
  if (roles.length > 0 && !roles.includes(user.role)) {
    return { authorized: false, user };
  }
  
  return { authorized: true, user };
}

/**
 * Middleware for Next.js 13+ app directory
 * Redirects unauthenticated users to login page
 */
export async function authMiddleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];
  
  // Allow public paths and API routes
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Redirect to login if not authenticated
  if (!session) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === UserRole.ADMIN;
}

/**
 * Get the current user's ID
 * @returns The current user's ID or null if not authenticated
 */
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id || null;
}
