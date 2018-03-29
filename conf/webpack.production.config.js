const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  CleanWebpackPlugin = require("clean-webpack-plugin");
  UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const
  merge = require("webpack-merge");

module.exports = (dirname, overrides = {}) => {

  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist"),
    webpackBase = require("./webpack.base.config")(dirname);

  return merge(webpackBase, {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
        ...overrides.DefinePlugin,
      }),
      new CleanWebpackPlugin(appDir, { root: dirname, verbose: false, ...overrides.CleanWebpackPlugin }),
      new HtmlWebpackPlugin({ title: "", ...overrides.HtmlWebpackPlugin }),
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          comments: false,
        },
        ...overrides.UglifyJsPlugin,
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: srcDir,
          exclude: [path.resolve(dirname, "node_modules")],
          loader: "babel-loader",
          options: {
            compact: true,
          },
        }, // js
        {
          test: /\.(s[ac]ss|css)$/,
          include: srcDir,
          loaders: ExtractTextPlugin.extract(["css-loader", "sass-loader"]),
        }, // css / sass
      ],
    },
  });
};
