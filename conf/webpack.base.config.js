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
    entry: [
      `${srcDir}/index.js`,
    ],
    output: {
      path: appDir,
      filename: "bundle.js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".css", ".scss", ".sass"],
      modules: [srcDir, "node_modules"],
    },
    plugins: [
      new ExtractTextPlugin({
        filename: `bundle.css`,
        allChunks: true,
      }),
    ],
    module: {
      loaders: [{
        test: /\.css$/,
        include: srcDir,
        loaders: ExtractTextPlugin.extract(["css-loader"]), // styles
      }, {
        test: /\.s[ac]ss$/,
        include: srcDir,
        loaders: ExtractTextPlugin.extract(["css-loader", "sass-loader"]), // styles
      }]
    },
  };
}
