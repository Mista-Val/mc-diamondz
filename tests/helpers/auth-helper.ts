import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  emailVerified: Date | null;
}

/**
 * Create a test user in the database
 */
export async function createTestUser(
  userData: Partial<TestUser> = {}
): Promise<TestUser> {
  const testUser = {
    id: randomUUID(),
    email: `test-${randomUUID()}@example.com`,
    password: 'password123',
    name: 'Test User',
    role: UserRole.USER,
    emailVerified: new Date(),
    ...userData,
  };

  // Hash the password
  const hashedPassword = await hash(testUser.password, 12);

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      id: testUser.id,
      email: testUser.email,
      password: hashedPassword,
      name: testUser.name,
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
  // First, get a CSRF token
  const csrfResponse = await fetch('http://localhost:3000/api/csrf');
  const csrfToken = csrfResponse.headers.getSetCookie()[0].split(';')[0].split('=')[1];

  // Then, get a session token
  const signInResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
      redirect: false,
    }),
  });

  if (!signInResponse.ok) {
    throw new Error('Failed to authenticate test user');
  }

  // Get the session cookie
  const sessionCookie = signInResponse.headers.getSetCookie().find(cookie => 
    cookie.startsWith('next-auth.session-token=')
  );

  if (!sessionCookie) {
    throw new Error('No session cookie found in response');
  }

  return {
    'Content-Type': 'application/json',
    'Cookie': sessionCookie,
    'x-csrf-token': csrfToken,
  };
}

/**
 * Clean up all test data
 */
export async function cleanupTestData(): Promise<void> {
  // Delete all test users (emails starting with 'test-')
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: 'test-',
      },
    },
  });

  // Delete all verification tokens
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: {
        startsWith: 'test-',
      },
    },
  });
}

// Clean up test data before exiting
process.on('beforeExit', async () => {
  await cleanupTestData();
  await prisma.$disconnect();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
