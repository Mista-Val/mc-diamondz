// Import test environment setup
import './tests/setup-env';

// Import test database setup
import './prisma/test-setup';

// Mock next-auth
jest.mock('next-auth', () => ({
  ...jest.requireActual('next-auth'),
  getServerSession: jest.fn(() => ({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  })),
}));

// Mock next-auth/next
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => ({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  })),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn((name: string) => {
      if (name === 'next-auth.session-token') {
        return { value: 'test-session-token' };
      }
      return null;
    }),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPrefetch = jest.fn();
const mockBack = jest.fn();
const mockEvents = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
    events: mockEvents,
  }),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}));

// Mock next-auth/react
const mockSession = {
  data: {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
  status: 'authenticated' as const,
};

jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(() => mockSession),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(() => Promise.resolve(mockSession.data)),
  getCsrfToken: jest.fn(),
  getProviders: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Mock ResizeObserver
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverStub;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock console methods to reduce test noise
const consoleError = console.error;
const consoleWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    // Suppress specific warnings that are expected
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React does not recognize the `%s` prop on a DOM element') ||
        args[0].includes('Unknown event handler property') ||
        args[0].includes('validateDOMNesting'))
    ) {
      return;
    }
    consoleError(...args);
  });

  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    // Suppress specific warnings that are expected
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Deprecation warning:') ||
        args[0].includes('Please use the `%s` component instead'))
    ) {
      return;
    }
    consoleWarn(...args);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});
