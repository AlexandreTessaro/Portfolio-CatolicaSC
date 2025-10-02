export default {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.js',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {},
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  testTimeout: 10000
};