module.exports = (dirname, environment, overrides)  => {
  const env = environment || "development";

  if (!["development", "production"].includes(env)) throw new Error(`Environment should be one of: development, production. Got ${env}`);

  const config = require(`./conf/webpack.${env}.config`); // eslint-disable-line

  return config(dirname, overrides);
};
