import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app's root directory (where next.config.js and .env files are located).
  // Since your next.config.ts is in the project root, this should be './'.
  dir: './',
});

// I'm adding any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8', // I'm specifying the coverage provider. I find 'v8' to be modern and efficient.
  testEnvironment: 'jsdom', // I'm setting up a JSDOM environment for testing my React components.
  // I'm adding more setup options before each test is run
  setupFilesAfterEnv: [], // This points to a file that I want to run after Jest is set up, for my global test configurations. E.g., ['<rootDir>/jest.setup.ts']
  moduleNameMapper: {
    // I'm handling module aliases (this should match the paths in my tsconfig.json)
    // If I chose src/ directory and default alias:
    '^@/(.*)$': '<rootDir>/src/$1',
    // If I did not choose src/ directory and default alias:
    // '^@/(.*)$': '<rootDir>/$1',
  },
  // By default, next/jest handles mocking of CSS Modules, global CSS, and image imports for me.
  // If I have other types of assets or specific needs, I might add more moduleNameMapper rules or transform settings here.
};

// I'm exporting createJestConfig this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
