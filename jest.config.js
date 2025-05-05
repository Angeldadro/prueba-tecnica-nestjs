module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@orders/(.*)$': '<rootDir>/contexts/orders/$1',
    '^@shippings/(.*)$': '<rootDir>/contexts/shippings/$1',
    '^@users/(.*)$': '<rootDir>/contexts/users/$1',
  },
}; 