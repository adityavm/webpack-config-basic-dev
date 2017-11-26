const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  CleanWebpackPlugin = require("clean-webpack-plugin");

const
  merge = require("webpack-merge");

module.exports = dirname => {

  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist"),
    webpackBase = require("./webpack.base.config")(dirname);

  return merge(webpackBase, {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      new CleanWebpackPlugin(appDir),
      new HtmlWebpackPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourcemap: true,
        comments: false,
        compress: {
          warnings: false,
          comparisons: false,
        },
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: srcDir,
          loader: "babel-loader",
          options: {
            compact: true,
          },
        }, // js
        // { test: /\.s[ac]ss$/, include: srcDir, loaders: ["style-loader", "css-loader", "sass-loader"] }, // styles
      ],
    },
  });
};
