import { TestUser, createTestUser, cleanupTestData } from '../helpers/auth-helper';
import { prisma } from '../../prisma/test-setup';
import { hash } from 'bcryptjs';

describe('Login API', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };

  beforeAll(async () => {
    // Create a test user before running the tests
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

  it('should log in a user with valid credentials', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message', 'Login successful');
    expect(data).toHaveProperty('user');
    expect(data.user).toHaveProperty('id');
    expect(data.user).toHaveProperty('email', testUser.email);
    expect(data.user).toHaveProperty('name', testUser.name);
    expect(data.user).not.toHaveProperty('password');
    
    // Check for session cookie
    const cookies = response.headers.get('set-cookie');
    expect(cookies).toBeDefined();
    expect(cookies).toContain('next-auth.session-token');
  });

  it('should return 400 for missing credentials', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('email');
    expect(data.error).toContain('password');
  });

  it('should return 401 for invalid email', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return 401 for invalid password', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'wrongpassword',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return 403 for unverified email', async () => {
    // Create a user with unverified email
    const unverifiedUser = {
      name: 'Unverified User',
      email: `unverified-${Date.now()}@example.com`,
      password: 'password123',
    };

    await prisma.user.create({
      data: {
        name: unverifiedUser.name,
        email: unverifiedUser.email,
        password: await hash(unverifiedUser.password, 12),
        emailVerified: null, // Email not verified
      },
    });

    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: unverifiedUser.email,
        password: unverifiedUser.password,
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty('error', 'Please verify your email before logging in');
  });

  it('should return 400 for invalid request body', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid-json',
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Invalid request body');
  });
});
