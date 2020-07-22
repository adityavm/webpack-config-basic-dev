const
  webpack = require("webpack"),
  path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MiniCssPlugin = require("mini-css-extract-plugin"),
  StylelintWebpackPlugin = require("stylelint-webpack-plugin"),
  glob = require("glob"),
  fs = require("fs"),
  assign = require("lodash.assign");

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
    rules = [],
    plugins = [];

  // only run eslint if there's a config
  if (haveEslintConfig(dirname)) {
    rules.push({
      enforce: "pre",
      test: /\.js$/,
      include: srcDir,
      use: "eslint-loader",
    });
  }

  // only run stylelint if there's a config
  if (haveStylelintConfig(dirname)) {
    try {
      if (process.env.JEST_ENV) {
        console.log("STYLELINTWEBPACKPLUGIN");
      }
      plugins.push(new StylelintWebpackPlugin({ syntax: "scss" }));
    } catch (e) {
      throw new Error(`MissingPlugin: Stylelint is missing but a Stylelint configuration was detected. Please install Stylelint or remove the configuration. (${e})`)
    }
  }

  /*
   * Transform environment variables for injection for JS and CSS
   */
  let envVars = {};
  if (overrides.environmentVariables) {
    const env = overrides.environmentVariables;
    envVars = Object.keys(env).reduce((final, b) => {
      final.js[`process.env.${b.toUpperCase()}`] = JSON.stringify(env[b]);
      final.css = `${final.css}$${b.toUpperCase()}:"${env[b]}";`;
      return final;
    }, { js: {}, css: `` });
  }

  return merge({
    customizeArray(a, b, key) {
      return key === "entry.app"
        ? b
        : undefined;
    },
  })(webpackBase, {
    mode: "development",
    entry: {
      app: [`${srcDir}/index.js`],
    },
    plugins: [
      new webpack.DefinePlugin(envVars.js || {}), // define env vars
      new webpack.LoaderOptionsPlugin({ options: {} }),
      new HtmlWebpackPlugin(assign({ title: "", chunksSortMode: "none" }, overrides.HtmlWebpackPlugin)),
      ...plugins,
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: srcDir,
          exclude: [path.resolve(dirname, "node_modules")],
          use: "babel-loader",
        }, // js
        {
          test: /\.(s[ac]ss|css)$/,
          include: srcDir,
          use: [
            "style-loader", // use workaround till webpack-contrib/mini-css-extract-plugin#34 is resolved
            "css-loader",
            envVars.css ? { loader: "sass-loader", options: { additionalData: envVars.css } } : "sass-loader",
          ],
        }, // hmr styles
        ...rules,
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
        warnings: false,
        errors: true,
      },
      historyApiFallback: true,
    },
  });
};
