import commonjs from "rollup-plugin-commonjs"; // for resolving require()
import autoExternal from "rollup-plugin-auto-external"; // automatically including node_modules stuff as external
import json from "rollup-plugin-json"; // for loading json files
import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    {
      name: pkg.name,
      file: pkg.main,
      format: "umd"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  plugins: [commonjs(), autoExternal(), json()]
};
