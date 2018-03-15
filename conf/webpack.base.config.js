const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = dirname => {
  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist");

  return {
    entry: {
      app: [
        `${srcDir}/index.js`,
      ],
      vendor: ["react", "react-dom", "react-redux", "redux", "classnames"],
    },
    output: {
      path: appDir,
      filename: "js/[name].bundle.js",
      chunkFilename: "js/[name].bundle.js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".css", ".scss", ".sass"],
      modules: [srcDir, "node_modules"],
    },
    devtool: "cheap-module-source-map",
    plugins: [
      new ExtractTextPlugin({
        filename: `css/bundle.css`,
        allChunks: true,
      }),
      new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "js/vendor.bundle.js" }), // allow chunks
    ],
  };
}
