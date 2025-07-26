/**
 * Jest setup file for Spring Test Profiler JavaScript tests
 */

// Mock DOM methods that are commonly used
function createMockElement() {
  return {
    setAttribute: jest.fn(),
    appendChild: jest.fn(),
    textContent: '',
    innerHTML: '',
    title: '',
    value: '',
    disabled: false,
    style: {
      display: 'block',
      cssText: '',
      left: '',
      top: ''
    },
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(() => false),
      toggle: jest.fn()
    },
    children: [],
    nextElementSibling: null,
    parentNode: null,
    querySelector: jest.fn(),
    addEventListener: jest.fn()
  };
}

global.document = {
  getElementById: jest.fn(() => createMockElement()),
  createElement: jest.fn(() => createMockElement()),
  addEventListener: jest.fn(),
  body: {
    innerHTML: '',
    appendChild: jest.fn()
  }
};

// Mock window object
global.window = {
  contextStatistics: []
};

// Mock console methods to avoid spam in tests
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};
