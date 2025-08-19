// jest.global-setup.js
module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mc_diamondz_test';
  
  // Mock any global objects needed for tests
  global.console = {
    ...console,
    // Override console methods if needed
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };

  // Set up any other global test configurations
  process.env.JWT_SECRET = 'test-secret';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.NEXTAUTH_SECRET = 'test-nextauth-secret';
  process.env.RESEND_API_KEY = 'test-resend-api-key';
  process.env.EMAIL_FROM_ADDRESS = 'test@example.com';
  process.env.EMAIL_FROM_NAME = 'Test Sender';
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
};
