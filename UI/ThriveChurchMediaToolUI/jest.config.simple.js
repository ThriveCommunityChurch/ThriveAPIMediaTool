module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/*.spec.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.spec.js'
  ]
};
