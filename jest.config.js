/** @type {import('jest').Config} */
const nextJest = require('next/jest');
const path = require('path');
const { loadEnvConfig } = require('@next/env');

// Load environment variables from .env.test
loadEnvConfig(process.cwd());

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Load setup files before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Handle module aliases
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jsdom',
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|vfile|vfile-message|unist-util-stringify-position|unist-util-position|unist-util-generated|unist-util-position-from-estree|unist-util-remove-position|unist-util-visit|unist-util-visit-parents|unist-util-is|unist-util-is|unist-util-stringify-position|unist-util-visit|unist-util-visit-parents|unist-util-is|unist-util-stringify-position|unist-util-visit|unist-util-visit-parents|unist-util-is|unist-util-stringify-position|unist-util-visit|unist-util-visit-parents|unist-util-is|unist-util-stringify-position|unist-util-visit|unist-util-visit-parents|unist-util-is)/)',
  ],
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/prisma/(.*)$': '<rootDir>/prisma/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/emails/(.*)$': '<rootDir>/emails/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/next.config.js',
    '!**/tailwind.config.js',
    '!**/postcss.config.js',
    '!**/babel.config.js',
  ],
  
  // Global setup and teardown
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
  
  // Test timeout
  testTimeout: 10000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
