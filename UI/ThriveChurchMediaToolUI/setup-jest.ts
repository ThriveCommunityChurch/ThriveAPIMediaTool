import 'jest-preset-angular/setup-jest';

// Global mocks for jsdom
const mock = () => {
  let storage: {[key: string]: string} = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

// Mock Chart.js to avoid issues with canvas
jest.mock('chart.js', () => ({
  Chart: jest.fn(),
  registerables: [],
}));

// Mock moment libraries
jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return moment;
});

jest.mock('moment-timezone', () => {
  const momentTimezone = jest.requireActual('moment-timezone');
  return momentTimezone;
});
