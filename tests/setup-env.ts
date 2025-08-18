// tests/setup-env.ts

// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.DATABASE_URL = 'file:./test.db';
process.env.RESEND_API_KEY = 'test-resend-api-key';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.EMAIL_FROM_NAME = 'Test Sender';
process.env.EMAIL_FROM_ADDRESS = 'test@example.com';
process.env.CSRF_SECRET = 'test-csrf-secret';

// Mock console methods to reduce test noise
const originalConsole = { ...console };

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Restore original console methods after all tests
afterAll(() => {
  global.console = originalConsole;
});
