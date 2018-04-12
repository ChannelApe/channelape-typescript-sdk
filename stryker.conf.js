module.exports = function(config) {
  config.set({
    files: [
      "test/**/*.ts",
      "src/**/*.ts",
      "!src/index.ts"
    ],
    testRunner: "mocha",
    mutator: "typescript",
    transpilers: ["typescript"],
    reporter: ["clear-text", "progress", "html"],
    testFramework: "mocha",
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    thresholds: { high: 80, low: 60, break: 65 },
    mutate: [
      "src/**/*.ts",
      "!src/types/*d.ts",
      "!src/index.ts"
    ]
  });
};
