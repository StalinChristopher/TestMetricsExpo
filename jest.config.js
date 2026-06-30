module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "src/query/queryClient.ts",
    "src/theme/AppColors.ts",
    "src/third-party/i18n/i18n.ts",
    "src/third-party/i18n/getDeviceLanguageTag.ts",
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: { lines: 80 },
  },
};
