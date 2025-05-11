import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // I'm providing the path to my Next.js app to load next.config.js and .env files in my test environment.
    dir: './src/',
});

// I'm adding any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8', // I'm specifying the coverage provider. I find 'v8' to be modern and efficient.
    testEnvironment: 'jsdom', // I'm setting up a JSDOM environment for testing my React components.
    // I'm adding more setup options before each test is run
    setupFilesAfterEnv:, // This points to a file that I want to run after Jest is set up, for my global test configurations.
    moduleNameMapper: {
 //src/ directory and default alias:
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // By default, next/jest handles mocking of CSS Modules, global CSS, and image imports for me.
    // If I have other types of assets or specific needs, add more moduleNameMapper rules or transform settings here.
};

// I'm exporting createJestConfig this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);