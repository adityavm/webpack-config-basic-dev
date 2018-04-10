# webpack-config-basic-dev

Basic Webpack config with React, SASS, HMR and optional ESLint and Stylelint support.

[![Build Status](https://img.shields.io/travis/adityavm/webpack-config-basic-dev/master.svg?style=flat-square)](https://travis-ci.org/adityavm/webpack-config-basic-dev)


## Usage

```shell
npm i webpack webpack-serve react react-dom babel-core # dependencies
npm i webpack-config-basic-dev
```
**Note:** You will need the first line of dependencies to ultimately build successfully, but they are not required by this module and are listed here for convenience.

For ESLint and Stylelint, check the [wiki][1].

Create a `webpack.config.js` in your app directory's root, and add the following lines:

```javascript
const config = require("webpack-config-basic-dev")(__dirname, process.env.NODE_ENV);
module.exports = config;
```

Add your package scripts as normal:

```javascript
{
  ...
  "scripts": {
    ...
    "start": "webpack-dev-server",
    "build": "NODE_ENV=production webpack" // to set environment correctly
  },
}
```

## Assumptions

The module assumes your app folder follows the following structure:

```
AppRoot
  + src         // all source
    - index.js  // entry
  + dist        // build folder
  - package.json
  - ...
```

## Advanced

The module accepts a third argument as option overrides for plugins. To override the options for a plugin, provide its name in camelcase as the key, and an object of options to override. Eg. to override options for the `html-webpack-plugin`:

```javascript
const overrides = {
  HtmlWebpackPlugin: {
    title: "MyApp",
  },
};
const config = require("webpack-config-basic-dev")(__dirname, process.env.NODE_ENV, overrides);
module.exports = config;
```

The override object also has accepts an object called `environmentVariables` which will be used to supply environment variables to both Javascript (through `webpack.DefinePlugin`) and Sass (through `sass-loader` options). Eg.

```javascript
const overrides = {
  abcd: "efgh",
};
// Accessed as process.env.ABCD in Javascript and $ABCD in Sass
```

# License

[MIT][2].

[1]: https://github.com/adityavm/webpack-config-basic-dev/wiki/Additional-Notes
[2]: https://github.com/adityavm/webpack-config-basic-dev/blob/master/LICENSE
