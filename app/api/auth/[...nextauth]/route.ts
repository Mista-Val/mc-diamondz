/**
 * @swagger
 * /api/auth/*:
 *   description: NextAuth.js authentication endpoints
 *   tags: [Authentication]
 */
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/options';

// NextAuth.js handler for all auth routes
const handler = NextAuth({
  ...authOptions,
  // Add additional NextAuth configuration if needed
});

export { handler as GET, handler as POST };

/**
 * API Endpoints:
 * 
 * 1. Authentication:
 *    - POST /api/auth/signin - Sign in with credentials or OAuth
 *    - POST /api/auth/signout - Sign out the current user
 *    - POST /api/auth/session - Get the current session
 *    - POST /api/auth/csrf - Get CSRF token
 *    - GET|POST /api/auth/providers - Get available auth providers
 *    - GET|POST /api/auth/callback/* - OAuth callback handlers
 *    - GET|POST /api/auth/error - Error handler for auth failures
 * 
 * 2. User Management:
 *    - POST /api/auth/register - Register a new user
 *    - GET /api/auth/session - Get current user session
 *    - POST /api/auth/logout - Log out the current user
 */
