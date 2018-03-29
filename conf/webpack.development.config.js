const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  StylelintWebpackPlugin = require("stylelint-webpack-plugin"),
  glob = require("glob"),
  fs = require("fs");

const
  merge = require("webpack-merge");

const haveEslintConfig = dir => {
  const
    matchesDefault = glob.sync(`${dir}/.eslint*`),
    matchesPackage = require(`${dir}/package.json`).eslintConfig;
  return matchesDefault.length > 0 || matchesPackage;
}

const haveStylelintConfig = dir => {
  const
    matchesDefault = glob.sync(`${dir}/.stylelint*`),
    matchesPackage = require(`${dir}/package.json`).stylelint;
  return matchesDefault.length > 0 || matchesPackage;
}

module.exports = (dirname, overrides = {}) => {
  const
    srcDir = path.resolve(dirname, "src"),
    appDir = path.resolve(dirname, "dist");

  const
    webpackBase = require("./webpack.base.config")(dirname);

  const
    loaders = [],
    plugins = [];

  // only run eslint if there's a config
  if (haveEslintConfig(dirname)) {
    loaders.push({
      enforce: "pre",
      test: /\.js$/,
      include: srcDir,
      loader: "eslint-loader",
    });
  }

  // only run stylelint if there's a config
  if (haveStylelintConfig(dirname)) {
    if (process.env.JEST_ENV) {
      console.log("STYLELINTWEBPACKPLUGIN");
    }
    plugins.push(new StylelintWebpackPlugin({ syntax: "scss" }));
  }

  return merge({
    customizeArray(a, b, key) {
      return key === "entry.app"
        ? b
        : undefined;
    },
  })(webpackBase, {
    entry: {
      app: [
        "react-hot-loader/patch",
        "webpack-dev-server/client?http://localhost:8008",
        `${srcDir}/index.js`,
      ],
    },
    plugins: [
      new webpack.NamedModulesPlugin({ ...overrides.NamedModulesPlugin }),
      new webpack.HotModuleReplacementPlugin({ title: "", ...overrides.HotModuleReplacementPlugin }),
      new HtmlWebpackPlugin({ ...overrides.HtmlWebpackPlugin }),
      ...plugins,
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: srcDir,
          exclude: [path.resolve(dirname, "node_modules")],
          loader: "babel-loader",
        }, // js
        {
          test: /\.(s[ac]ss|css)$/,
          include: srcDir,
          loaders: ["css-hot-loader"].concat(ExtractTextPlugin.extract(["css-loader", "sass-loader"])),
        }, // hmr styles
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
      historyApiFallback: true,
    },
  });
};
