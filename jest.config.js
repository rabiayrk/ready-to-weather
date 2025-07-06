const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
};

module.exports = async () => {
  const jestConfig = await createJestConfig(customJestConfig)();

  jestConfig.transformIgnorePatterns = [
    '/node_modules/(?!(@auth/prisma-adapter|next-auth|jose)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];

  return jestConfig;
};