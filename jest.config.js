/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.test.[tj]s', '**/__tests__/*.spec.[tj]s'],
  testPathIgnorePatterns: ['node_modules/*', 'dist/*', 'dist/package.json'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'cobertura'],
};
