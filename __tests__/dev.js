const path = require("path");

beforeEach(() => {
  process.env.JEST_ENV = true;
  process.env.NODE_ENV = "development"
});

afterEach(() => {
  jest.resetModules();
  process.env.NODE_ENV = null;
});

it("should fail if no environment provided", () => {
  const config = require("../");
  expect(() => config()).toThrow();
});

it("should have HRM and entry files in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const devConfig = config(dir);

  expect(devConfig.entry).toEqual([
    `react-hot-loader/patch`,
    `webpack-dev-server/client?http://localhost:8008`,
    `${dir}/src/index.js`
  ]);
});

it("should have only html webpack and HMR plugins in development env", () => {
  jest.spyOn(global.console, "log").mockImplementation(() => null);

  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const devConfig = config(dir);
  const webpack = require("webpack");
  const HtmlWebpackPlugin = require("html-webpack-plugin");

  expect(devConfig.plugins).toContainEqual(expect.any(HtmlWebpackPlugin));
  expect(devConfig.plugins).toContainEqual(expect.any(webpack.NamedModulesPlugin));
  expect(devConfig.plugins).toContainEqual(expect.any(webpack.HotModuleReplacementPlugin));
  expect(console.log).not.toHaveBeenCalledWith("STYLELINTWEBPACKPLUGIN");

  global.console.log.mockRestore();
});

// TODO better test?
it("should have stylelint plugin in development env", () => {
  jest.spyOn(global.console, "log").mockImplementation(() => null);

  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithStylelint");
  const devConfig = config(dir);

  expect(console.log).toHaveBeenCalledWith("STYLELINTWEBPACKPLUGIN");

  global.console.log.mockRestore();
});

it("should have correct loaders in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithPkgJson");
  const devConfig = config(dir);
  const ExtractTextPlugin = require("extract-text-webpack-plugin");

  expect(devConfig.module.loaders).toContainEqual({
    test: /\.js$/,
    include: `${dir}/src`,
    loader: "babel-loader",
  });
  expect(devConfig.module.loaders).toContainEqual({
    test: /\.(s[ac]ss|css)$/,
    include: `${dir}/src`,
    loaders: ["css-hot-loader"].concat(ExtractTextPlugin.extract(["css-loader", "sass-loader"])),
  });
  // eslint
  expect(devConfig.module.loaders).not.toContainEqual({
    enforce: "pre",
    test: /\.js$/,
    include: `${dir}/src`,
    loader: "eslint-loader",
  });
});

it("should have eslint-loader in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const devConfig = config(dir);

  expect(devConfig.module.loaders).toContainEqual({
    enforce: "pre",
    test: /\.js$/,
    include: `${dir}/src`,
    loader: "eslint-loader",
  });
});

it("should have devserver config in development env", () => {
  const config = require("../");
  const dir = path.resolve(__dirname, "dirWithEslint");
  const devConfig = config(dir);

  expect(devConfig.devServer).toBeTruthy();

  // test separately to not fail on path
  expect(devConfig.devServer.contentBase).toBe(`${dir}/dist`);
  delete devConfig.devServer.contentBase;

  expect(devConfig.devServer).toMatchSnapshot();
});
