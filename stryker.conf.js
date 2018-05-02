module.exports = function(config) {
  config.set({
    files: [
      "test/**/*.ts",
      "src/**/*.ts",
      "!e2e/**/*.ts",
    ],
    testRunner: "mocha",
    mutator: "typescript",
    transpilers: ["typescript"],
    reporter: ["clear-text", "progress", "html"],
    testFramework: "mocha",
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    thresholds: { high: 90, low: 70, break: 91 },
    mutate: [
      "src/**/*.ts",
      "!src/types/*d.ts"
    ]
  });
};
