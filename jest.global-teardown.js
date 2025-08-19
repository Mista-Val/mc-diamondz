// jest.global-teardown.js
module.exports = async () => {
  // Clean up any resources created during tests
  // For example, close database connections, clear mocks, etc.
  
  // Reset all mocks
  jest.clearAllMocks();
  
  // Close any open handles or connections
  // If you're using a test database, you might want to drop it here
  
  // Reset any global state that was modified during tests
  jest.resetModules();
  
  // Clear any timers
  if (global.setTimeout.mock) {
    jest.clearAllTimers();
  }
};
