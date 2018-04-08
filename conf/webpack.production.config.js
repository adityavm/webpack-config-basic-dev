const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  CleanWebpackPlugin = require("clean-webpack-plugin");
  UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
  assign = require("lodash.assign");

const
  merge = require("webpack-merge");

module.exports = (dirname, overrides = {}) => {

  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist"),
    webpackBase = require("./webpack.base.config")(dirname);

  return merge(webpackBase, {
    mode: "production",
    plugins: [
      new webpack.DefinePlugin(assign(
        { "process.env.NODE_ENV": JSON.stringify("production")},
        overrides.DefinePlugin,
      )),
      new CleanWebpackPlugin(appDir, assign({ root: dirname, verbose: false }, overrides.CleanWebpackPlugin)),
      new HtmlWebpackPlugin(assign({ title: "" }, overrides.HtmlWebpackPlugin)),
    ],
    module: {
      rules: [
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
