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
    moduleNameMapper: {
        // Base src mapping
        '^src$': '<rootDir>/src',
        '^src/(.*)$': '<rootDir>/src/$1',
        '^test/(.*)$': '<rootDir>/test/$1',
        // Utils mappings
        '^src/utils/logger$': '<rootDir>/src/utils/logger/logger',
        '^src/utils/logger/(.*)$': '<rootDir>/src/utils/logger/$1',
        '^src/utils/(.*)$': '<rootDir>/src/utils/$1',
        // Core mappings
        '^src/core/ao/(.*)$': '<rootDir>/src/core/ao/$1',
        '^src/core/arweave/(.*)$': '<rootDir>/src/core/arweave/$1',
        // Client mappings
        '^src/clients/collection/(.*)$': '<rootDir>/src/clients/collection/$1',
        '^src/clients/nft/(.*)$': '<rootDir>/src/clients/nft/$1',
        '^src/clients/nft-sale/(.*)$': '<rootDir>/src/clients/nft-sale/$1',
        '^src/clients/profile/(.*)$': '<rootDir>/src/clients/profile/$1',
        '^src/clients/profile-registry/(.*)$': '<rootDir>/src/clients/profile-registry/$1',
        '^src/clients/random/(.*)$': '<rootDir>/src/clients/random/$1',
        '^src/clients/staking/(.*)$': '<rootDir>/src/clients/staking/$1',
        '^src/clients/token/(.*)$': '<rootDir>/src/clients/token/$1',
        // Service mappings
        '^src/services/messages/(.*)$': '<rootDir>/src/services/messages/$1'
    },
};
