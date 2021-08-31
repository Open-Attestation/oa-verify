module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  testTimeout: 30000,
};
