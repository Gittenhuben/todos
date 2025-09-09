import type { Config } from '@jest/types';
import 'jest-styled-components';

const config: Config.InitialOptions = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/store/**/*.ts}'
  ],
};

export default config;
