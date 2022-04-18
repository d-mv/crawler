module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src/__tests__'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@services(.*)$': '<rootDir>/src/services$1',
    '@tools(.*)$': '<rootDir>/src/tools$1',
    '@models(.*)$': '<rootDir>/src/models$1',
    '@classes(.*)$': '<rootDir>/src/classes$1',
    '@controllers(.*)$': '<rootDir>/src/controllers$1',
    '@data(.*)$': '<rootDir>/src/data$1',
    '@app(.*)$': '<rootDir>/src$1',
  },
};
