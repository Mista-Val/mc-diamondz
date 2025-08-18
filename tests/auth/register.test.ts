import { TestUser, createTestUser, cleanupTestData } from '../helpers/auth-helper';
import { prisma } from '../../prisma/test-setup';
import { hash } from 'bcryptjs';

describe('Registration API', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };

  afterEach(async () => {
    // Clean up test data after each test
    await cleanupTestData();
  });

  it('should register a new user with valid data', async () => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('message', 'User registered successfully');
    expect(data).toHaveProperty('user');
    expect(data.user).toHaveProperty('id');
    expect(data.user).toHaveProperty('email', testUser.email);
    expect(data.user).not.toHaveProperty('password');

    // Verify user was created in the database
    const dbUser = await prisma.user.findUnique({
      where: { email: testUser.email },
    });

    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(testUser.email);
    expect(dbUser?.name).toBe(testUser.name);
  });

  it('should return 400 for missing required fields', async () => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing name
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('name');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('email');
  });

  it('should return 400 for password that is too short', async () => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('password');
  });

  it('should return 409 if email already exists', async () => {
    // Create a user with the same email first
    await prisma.user.create({
      data: {
        name: 'Existing User',
        email: testUser.email,
        password: await hash(testUser.password, 12),
      },
    });

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toHaveProperty('error', 'Email already in use');
  });

  it('should hash the password before saving to the database', async () => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    expect(response.status).toBe(201);

    // Verify password was hashed
    const dbUser = await prisma.user.findUnique({
      where: { email: testUser.email },
    });

    expect(dbUser?.password).not.toBe(testUser.password);
    expect(dbUser?.password).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/); // bcrypt hash pattern
  });
});
