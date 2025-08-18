import { prisma } from '../../prisma/test-setup';
import { hash } from 'bcryptjs';
import { cleanupTestData, createTestUser, getCsrfToken } from '../helpers/auth-helper';

// Test user interface
interface TestUser {
  name: string;
  email: string;
  password: string;
}

describe('Password Reset API', () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const requestResetUrl = `${baseUrl}/api/auth/forgot-password`;
  const resetPasswordUrl = `${baseUrl}/api/auth/reset-password`;
  
  let testUser: TestUser;
  let resetToken: string;

  beforeAll(async () => {
    // Create a test user before running the tests
    testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'oldPassword123',
    };

    await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await hash(testUser.password, 12),
        emailVerified: new Date(),
      },
    });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData();
  });

  it('should return 400 for invalid email format', async () => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(requestResetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ email: 'invalid-email' }),
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('valid email');
  });

  it('should return 404 for non-existent email', async () => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(requestResetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ email: 'nonexistent@example.com' }),
    });

    // For security, we should return 200 even if the email doesn't exist
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message', 'If your email exists in our system, you will receive a password reset link');
  });

  it('should create a password reset token for valid email', async () => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(requestResetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ email: testUser.email }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message', 'If your email exists in our system, you will receive a password reset link');

    // Verify a reset token was created in the database
    const resetTokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: testUser.email,
        token: {
          startsWith: 'reset_',
        },
      },
    });

    expect(resetTokenRecord).toBeDefined();
    expect(resetTokenRecord?.token).toBeDefined();
    resetToken = resetTokenRecord?.token || '';
  });

  it('should return 400 for invalid reset token', async () => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(resetPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        token: 'invalid-token',
        password: 'newPassword123!',
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Invalid or expired reset token');
  });

  it('should return 400 for weak password', async () => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(resetPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        token: resetToken,
        password: 'weak',
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('password');
  });

  it('should successfully reset password with valid token', async () => {
    const csrfToken = await getCsrfToken();
    const newPassword = 'newSecurePassword123!';
    
    const response = await fetch(resetPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        token: resetToken,
        password: newPassword,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message', 'Password reset successful');

    // Verify the password was updated by attempting to log in with the new password
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        email: testUser.email,
        password: newPassword,
      }),
    });

    expect(loginResponse.status).toBe(200);
    const loginData = await loginResponse.json();
    expect(loginData).toHaveProperty('message', 'Login successful');
  });

  it('should invalidate reset token after use', async () => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(resetPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        token: resetToken,
        password: 'anotherNewPassword123!',
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Invalid or expired reset token');
  });
});
