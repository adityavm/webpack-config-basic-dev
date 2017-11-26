const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  glob = require("glob"),
  fs = require("fs");

const
  merge = require("webpack-merge");

const haveEslintConfig = dir => {
  const matchesDefault = glob.sync(`${dir}/.eslint*`);
  const matchesPackage = require(`${dir}/package.json`).eslintConfig;
  return matchesDefault.length > 0 || matchesPackage;
}

module.exports = dirname => {
  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist");

  const
    webpackBase = require("./webpack.base.config")(dirname);

  const loaders = [];

  // only run eslint if there's a config
  if (haveEslintConfig(dirname)) {
    loaders.push({
      enforce: "pre",
      test: /\.js$/,
      include: srcDir,
      loader: "eslint-loader",
    });
  }

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
        ...loaders,
      ]
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
