const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.paths.json");

module.exports = {
  roots: ["<rootDir>"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!.serverless/**",
    "!.webpack/**",
  ],
  coveragePathIgnorePatterns: [
    "src/libs/handlerResolver",
    "src/libs/lambda.ts",
    "src/model",
    "src/services/index.ts",
    "node_modules",
    "swagger",
    "serverless.ts",
    "jest.config.js",
    ".esbuild",
    "coverage",
    "src/functions",
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
