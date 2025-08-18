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
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/prisma/(.*)$': '<rootDir>/prisma/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/emails/(.*)$': '<rootDir>/emails/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/public/(.*)$': '<rootDir>/public/$1',
  },
  
  // Ignore paths
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/cypress/',
    '<rootDir>/coverage/',
  ],
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Test coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/cypress/**',
    '!**/pages/_app.tsx',
    '!**/pages/_document.tsx',
    '!**/jest.config.js',
    '!**/next.config.js',
    '!**/jest.setup.ts',
    '!**/jest.polyfills.js',
    '!**/middleware.ts',
    '!**/app/layout.tsx',
    '!**/app/globals.css',
    '!**/app/error.tsx',
    '!**/app/not-found.tsx',
    '!**/app/loading.tsx',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: 'coverage',
  
  // Test timeout
  testTimeout: 30000,
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  
  // Fake timers configuration
  fakeTimers: {
    enableGlobally: true,
  },
  
  // Reset mocks between tests
  resetMocks: true,
  
  // Clear mock calls and instances between tests
  clearMocks: true,
  
  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',
  
  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // An array of regexp pattern strings that are matched against all module paths before considered 'visible' to the module loader
  modulePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
    '<rootDir>/node_modules/'
  ],
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  watchPathIgnorePatterns: [
    '/node_modules/'
  ],
  
  // Setup files
  setupFiles: [
    '<rootDir>/jest.polyfills.js',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
