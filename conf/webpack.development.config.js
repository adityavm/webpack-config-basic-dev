const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

const
  merge = require("webpack-merge");

module.exports = dirname => {
  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist");

  const
    webpackBase = require("./webpack.base.config")(dirname);

  return merge({
    customizeArray(a, b, key) {
      return key === "entry"
        ? b
        : undefined;
    },
  })(webpackBase, {
    entry: [
      "react-hot-loader/patch",
      "webpack-dev-server/client?http://localhost:8008",
      `${srcDir}/index.js`,
    ],
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin(),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: srcDir,
          loader: "babel-loader",
        }, // js
        {
          enforce: "pre",
          test: /\.js$/,
          include: srcDir,
          loader: "eslint-loader",
        },
        // { test: /\.s[ac]ss$/, include: srcDir, loaders: ["style-loader", "css-loader", "sass-loader"] }, // styles
      ],
    },
    devServer: {
      host: "localhost",
      hot: true,
      compress: true,
      inline: true,
      port: 8008,
      contentBase: appDir,
      clientLogLevel: "error",
      noInfo: true,
      overlay: {
        warnings: true,
        errors: true,
      },
    },
  });
};
