const { i18n } = require('./next-i18next.config');
module.exports = {
  i18n,
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
