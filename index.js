module.exports = dirname => {
  const env = process.env.NODE_ENV || "development";

  if (!["development", "production"].includes(env)) throw new Error(`Environment should be one of: development, production. Got ${env}`);

  const config = require(`./conf/webpack.${env}.config`); // eslint-disable-line

  return config(dirname);
};
