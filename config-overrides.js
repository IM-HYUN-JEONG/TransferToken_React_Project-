/* config-overrides.js */

module.exports = function override(config, env) {
  //do stuff with the webpack config...

  config.resolve.fallback = {
    fs: false,
    net: false,
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url"),
    util: require.resolve("util"),
  };

  console.log(config, "@@config");

  return config;
};
