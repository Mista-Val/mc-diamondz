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

// Use a test database URL for PostgreSQL
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mc_diamondz_test';

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

// Generate a unique test database name to avoid conflicts
const generateTestDatabaseName = () => {
  return `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Run migrations on the test database
beforeAll(async () => {
  try {
    // Create a new test database
    const testDbName = generateTestDatabaseName();
    
    // Connect to the default database to create a new test database
    const setupPrisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://postgres:postgres@localhost:5432/postgres',
        },
      },
    });

    try {
      await setupPrisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${testDbName}`);
      await setupPrisma.$executeRawUnsafe(`CREATE DATABASE ${testDbName}`);
    } finally {
      await setupPrisma.$disconnect();
    }

    // Update the database URL to use the new test database
    const testDbUrl = `postgresql://postgres:postgres@localhost:5432/${testDbName}`;
    process.env.DATABASE_URL = testDbUrl;

    // Apply migrations to the test database
    execSync(`${prismaBinary} migrate deploy`, {
      env: {
        ...process.env,
        DATABASE_URL: testDbUrl,
      },
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to set up test database:', error);
    process.exit(1);
  }
});

// Clean up after all tests are done
afterAll(async () => {
  try {
    // Disconnect the Prisma client
    await prisma.$disconnect();
    
    // Drop the test database
    const testDbName = process.env.DATABASE_URL?.split('/').pop();
    if (testDbName) {
      const cleanupPrisma = new PrismaClient({
        datasources: {
          db: {
            url: 'postgresql://postgres:postgres@localhost:5432/postgres',
          },
        },
      });
      
      try {
        await cleanupPrisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${testDbName}`);
      } finally {
        await cleanupPrisma.$disconnect();
      }
    }
  } catch (error) {
    console.error('Error during test database cleanup:', error);
  }
});

// Clean up the database between tests
afterEach(async () => {
  const tables = await prisma.$queryRaw`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename != '_prisma_migrations';
  `;

  for (const table of tables as { tablename: string }[]) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${table.tablename}" CASCADE;`
    );
  }
});

export { prisma };
