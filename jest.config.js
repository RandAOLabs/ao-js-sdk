const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 60000,
    moduleFileExtensions: ['ts', 'js'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    //Makes imports work:
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^src$': '<rootDir>/src'
    },
    modulePaths: ['<rootDir>'],
    roots: ['<rootDir>']
    //Makes imports work^
};
