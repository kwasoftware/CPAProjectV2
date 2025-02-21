export default {
  testEnvironment: 'jsdom', // Simulates a browser-like environment
  extensionsToTreatAsEsm: ['.jsx'], // Treat .jsx files as ES Modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map for resolving @ to src folder
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // Mock CSS files
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest to transform JavaScript and JSX files
  },
  moduleFileExtensions: ['js', 'jsx'], // Recognized extensions
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup file for additional configurations
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|@babel|reactflow)/)', // Ensure reactflow is transformed
  ],
  moduleDirectories: ['node_modules', 'src'], // Include both node_modules and src for resolution
};