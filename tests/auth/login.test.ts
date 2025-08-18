import { prisma } from '../../prisma/test-setup';
import { hash } from 'bcryptjs';
import { cleanupTestData, getCsrfToken, TestUser } from '../helpers/auth-helper';

// API response interface
interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Headers;
}

describe('Login API', () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Test user data
  const testUser: TestUser = {
    id: '',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User',
    role: 'USER',
    emailVerified: new Date(),
  };

  // Helper function to make login requests
  async function loginUser(email: string, password: string): Promise<ApiResponse> {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      data,
      headers: response.headers,
    };
  }

  beforeAll(async () => {
    // Create a test user before running the tests
    await prisma.user.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        password: await hash(testUser.password, 12),
        emailVerified: testUser.emailVerified,
      },
    });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData();
    await prisma.$disconnect();
  });

  it('should log in a user with valid credentials', async () => {
    const response = await loginUser(testUser.email, testUser.password);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'Login successful');
    expect(response.data).toHaveProperty('user');
    expect(response.data.user).toHaveProperty('email', testUser.email);
    expect(response.data.user).toHaveProperty('name', testUser.name);
    
    // Check if session cookie is set
    const cookies = response.headers.get('set-cookie');
    expect(cookies).toBeDefined();
    expect(cookies).toContain('next-auth.session-token');
  });

  it('should return 400 for missing credentials', async () => {
    const response = await loginUser('', '');
    
    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('error', 'Email and password are required');
  });

  it('should return 401 for invalid password', async () => {
    const response = await loginUser(testUser.email, 'wrongpassword');
    
    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return 401 for non-existent user', async () => {
    const response = await loginUser('nonexistent@example.com', 'password123');
    
    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return 401 for unverified email', async () => {
    // Create a user with unverified email
    const unverifiedUser = {
      email: `unverified-${Date.now()}@example.com`,
      password: 'password123',
    };
    
    await prisma.user.create({
      data: {
        email: unverifiedUser.email,
        name: 'Unverified User',
        password: await hash(unverifiedUser.password, 12),
        emailVerified: null,
      },
    });
    
    const response = await loginUser(unverifiedUser.email, unverifiedUser.password);
    
    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('error', 'Please verify your email before logging in');
  });

  it('should return 400 for invalid request body', async () => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: 'invalid-json',
    });
    
    const data = await response.json().catch(() => ({}));
    
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Invalid request body');
  });
});
