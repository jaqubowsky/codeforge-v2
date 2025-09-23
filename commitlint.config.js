// biome-ignore-all lint/style/noMagicNumbers: everything is fine:)

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
      ],
    ],

    "header-max-length": [2, "always", 72],
    "subject-case": [0, "never"],
    "scope-enum": [
      2,
      "always",
      ["scraper", "web", "ui", "typescript-config", "all"],
    ],
  },
};
