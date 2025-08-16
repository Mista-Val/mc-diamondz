import { UserRole } from '@prisma/client';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
      // Add any other custom fields you need in the session
    } & DefaultSession['user'];
    accessToken?: string;
  }

  /**
   * Extend the built-in user types
   */
  interface User extends DefaultUser {
    role: UserRole;
    // Add any other custom fields from your database
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend the built-in JWT types
   */
  interface JWT {
    id: string;
    role: UserRole;
    accessToken?: string;
  }
}
