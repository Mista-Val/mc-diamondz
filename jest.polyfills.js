// Polyfills for Jest to work with Next.js

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverStub;

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock IntersectionObserver
class IntersectionObserverStub {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserverStub;

// Mock requestIdleCallback
window.requestIdleCallback = (fn) => {
  return setTimeout(() => fn({ didTimeout: false }), 0);
};

window.cancelIdleCallback = (id) => {
  clearTimeout(id);
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
);

// Mock console methods to reduce test noise
const originalConsole = { ...console };
const filterOutExpectedWarnings = (message) => {
  const suppressedMessages = [
    'React does not recognize the `%s` prop on a DOM element',
    'Unknown event handler property',
    'validateDOMNesting',
    'Deprecation warning:',
    'Please use the `%s` component instead',
    'The meta %s is specified multiple times',
    'Using kebab-case for css properties',
  ];

  return suppressedMessages.some((suppressedMessage) =>
    typeof message === 'string' && message.includes(suppressedMessage)
  );
};

// Override console methods to filter out expected warnings
['error', 'warn'].forEach((method) => {
  const originalMethod = console[method];
  console[method] = (...args) => {
    if (!filterOutExpectedWarnings(args[0])) {
      originalMethod.apply(console, args);
    }
  };
});

// Restore original console methods after tests
beforeEach(() => {
  global.fetch.mockClear();
  localStorageMock.clear();
  sessionStorageMock.clear();
  jest.clearAllMocks();
});

afterAll(() => {
  // Restore original console methods
  Object.defineProperty(console, 'error', {
    value: originalConsole.error,
  });
  Object.defineProperty(console, 'warn', {
    value: originalConsole.warn,
  });
});
