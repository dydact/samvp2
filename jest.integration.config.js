module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '<rootDir>/SAMVPquick/src/**/*.integration.test.(ts|tsx)',
    '<rootDir>/SiteAware/shared/src/**/*.integration.test.(ts|tsx)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/SAMVPquick/src/$1',
    '^@shared/(.*)$': '<rootDir>/SiteAware/shared/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
} 