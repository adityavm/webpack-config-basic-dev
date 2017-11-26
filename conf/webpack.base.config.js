const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = dirname => {
  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist");

  return {
    entry: [
      `${srcDir}/index.js`,
    ],
    output: {
      path: appDir,
      filename: "bundle.js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".scss", ".sass"],
      modules: [srcDir, "node_modules"],
    },
  };
}
