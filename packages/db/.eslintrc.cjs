/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@repo/lint/node')],
  ignorePatterns: ['mocks/test-overrides/*.ts', 'temp/*.ts'],
};
