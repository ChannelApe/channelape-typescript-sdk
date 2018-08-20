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
    reporters: ["clear-text", "progress", "html"],
    testFramework: "mocha",
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    thresholds: { high: 90, low: 70, break: 90 },
    mochaOptions: {
      files: [
        "test/**/*.ts",
        "src/*",
        "!src/types/*d.ts"
      ],
      opts: 'test/mocha.opts'
    },
    mutate: [
      "src/**/*.ts",
      "!src/types/*d.ts"
    ]
  });
};
