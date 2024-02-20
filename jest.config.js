module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  testTimeout: 30000,
  moduleNameMapper: {
    axios: "axios/dist/node/axios.cjs", // Temporary workaround: Force Jest to import the CommonJS Axios build
  },
};