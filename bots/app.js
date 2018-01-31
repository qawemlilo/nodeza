

let appInstance = null;



module.exports = function () {
  if (appInstance) return appInstance;

  const App = require('widget-cms');
  const config = require('../config');
  const env = process.env.NODE_ENV || 'staging';

  App.config({
    port: 3033,
    secret: 'my_ninja_cat',

    db: config.db[env],

    rootDir: process.cwd(),
    modelsDir: path.join(__dirname, '..', 'models'),
    cache: false,
    saveLogs: false,
    middleware: {
      enableForms: false,
      enableCSRF: false,
      inputValidation: false,
      enableSessions: false
    }
  });

  appInstance = App.start();

  return appInstance;
}
