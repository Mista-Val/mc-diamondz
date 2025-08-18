import { PrismaClient, User, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface TestUser extends Partial<User> {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  emailVerified: Date | null;
}

/**
 * Get a CSRF token for testing authenticated requests
 */
export async function getCsrfToken(): Promise<string> {
  try {
    const response = await fetch(`${baseUrl}/api/csrf`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get CSRF token: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw error;
  }
}

/**
 * Create a test user in the database
 */
export async function createTestUser(
  userData: Partial<TestUser> = {}
): Promise<TestUser> {
  const testUser: TestUser = {
    id: randomUUID(),
    email: `test-${randomUUID()}@example.com`,
    password: 'password123',
    name: 'Test User',
    role: 'USER',
    emailVerified: new Date(),
    ...userData,
  };

  const hashedPassword = await hash(testUser.password, 12);
  
  const user = await prisma.user.create({
    data: {
      id: testUser.id,
      email: testUser.email,
      name: testUser.name,
      password: hashedPassword,
      role: testUser.role,
      emailVerified: testUser.emailVerified,
    },
  });

  return {
    ...user,
    password: testUser.password, // Return the plain password for testing
  };
}

/**
 * Delete a test user from the database
 */
export async function deleteTestUser(email: string): Promise<void> {
  await prisma.user.deleteMany({
    where: { email },
  });
}

/**
 * Get authentication headers for a test user
 */
export async function getAuthHeaders(user: TestUser): Promise<Record<string, string>> {
  const csrfToken = await getCsrfToken();
  
  // First, log in the user to get the session cookie
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to log in user: ${response.statusText}`);
  }

  // Get the session cookie from the response
  const cookies = response.headers.get('set-cookie');
  if (!cookies) {
    throw new Error('No session cookie found in login response');
  }

  // Return headers with CSRF token and session cookie
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
    'Cookie': cookies,
  };
}

/**
 * Clean up all test data
 */
export async function cleanupTestData(): Promise<void> {
  // Delete all test users
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: '@example.com',
      },
    },
  });
}

// Clean up test data before exiting
process.on('beforeExit', async () => {
  try {
    await cleanupTestData();
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
});

// Export Prisma client for direct database access in tests
export { prisma };