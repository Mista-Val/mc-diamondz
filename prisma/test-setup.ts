// prisma/test-setup.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';

const prismaBinary = join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  'prisma'
);

const testDatabaseUrl = 'file:./test.db';

// Set the test database URL
process.env.DATABASE_URL = testDatabaseUrl;

// Create a new Prisma client for testing
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl,
    },
  },
});

// Run migrations on the test database
beforeAll(async () => {
  try {
    // Reset the test database
    execSync(`${prismaBinary} migrate reset --force`, {
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
      },
      stdio: 'pipe',
    });

    // Apply migrations
    execSync(`${prismaBinary} migrate deploy`, {
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
      },
      stdio: 'pipe',
    });
  } catch (error) {
    console.error('Failed to set up test database:', error);
    process.exit(1);
  }
});

// Clean up after all tests are done
afterAll(async () => {
  await prisma.$disconnect();
});

// Clean up the database between tests
afterEach(async () => {
  // Delete all data from the test database
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => `"public"."${tablename}"`)
    .join(', ');

  try {
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
});

export { prisma };
