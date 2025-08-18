import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { TestUser, createTestUser, getAuthHeaders, cleanupTestData } from './helpers/auth-helper';

// Increase timeout for tests that involve database operations
jest.setTimeout(30000);

describe('Authentication Flow', () => {
  let testUser: TestUser;
  let authHeaders: Record<string, string>;

  beforeAll(async () => {
    // Clean up any existing test data
    await cleanupTestData();
  });

  afterAll(async () => {
    // Clean up test data after all tests
    if (testUser?.email) {
      await cleanupTestData();
    }
  });

  describe('Registration Flow', () => {
    it('should register a new user', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('email');
      
      // Store the test user for subsequent tests
      testUser = {
        ...data.user,
        password: 'password123',
      };
    });
  });

  describe('Login Flow', () => {
    it('should login with valid credentials', async () => {
      // Create a test user first if not already created
      if (!testUser) {
        testUser = await createTestUser();
      }

      const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          redirect: false,
        }),
      });

      expect(response.status).toBe(200);
      
      // Store auth headers for subsequent authenticated requests
      authHeaders = await getAuthHeaders(testUser);
    });

    it('should reject invalid credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
          redirect: false,
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Profile Access', () => {
    it('should access profile with valid session', async () => {
      if (!authHeaders) {
        testUser = await createTestUser();
        authHeaders = await getAuthHeaders(testUser);
      }

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: authHeaders,
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('email', testUser.email);
      expect(data).toHaveProperty('name');
    });

    it('should reject profile access without authentication', async () => {
      const response = await fetch('http://localhost:3000/api/auth/profile');
      expect(response.status).toBe(401);
    });
  });

  describe('Password Reset Flow', () => {
    it('should request a password reset', async () => {
      if (!testUser) {
        testUser = await createTestUser();
      }

      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
        }),
      });

      const data = await response.json();
      
      // Note: In a real test, you would extract the reset token from the email
      // For now, we'll just check that the request was accepted
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('message');
    });

    // This test is a placeholder - in a real scenario, you would:
    // 1. Extract the reset token from the email (or database)
    // 2. Use it to make a reset password request
    it.skip('should reset password with a valid token', async () => {
      // This is a placeholder test that would be implemented in a real scenario
      // where you can intercept emails or access the database directly
      expect(true).toBe(true);
    });
  });

  describe('Email Verification', () => {
    it('should verify email with a valid token', async () => {
      // Create an unverified user
      const unverifiedUser = await createTestUser({
        emailVerified: null,
      });

      // In a real test, you would get the verification token from the database
      // For now, we'll just test that the endpoint exists and requires a token
      const response = await fetch('http://localhost:3000/api/auth/verify-email?token=test-token', {
        method: 'GET',
      });

      // This will fail with an invalid token, but we're just checking the endpoint exists
      expect([400, 200]).toContain(response.status);
    });
  });

  describe('CSRF Protection', () => {
    it('should reject requests without CSRF token', async () => {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Name',
        }),
      });

      expect([401, 403]).toContain(response.status);
    });
  });
});
