
var secrets = require('./secrets.json');

module.exports = {

  siteName: secrets.siteName || '',

  title: secrets.title || '',

  description: secrets.description || '',

  keywords: secrets.keywords || '',

  twitter_url: secrets.twitter_url || '',

  github_url: secrets.github_url || '',

  port: secrets.port || 3000,

  maxAge: secrets.maxAge || 7,

  activateCSRF: secrets.activateCSRF || true,

  csrfWhitelist: secrets.csrfWhitelist || [],

  client: 'mysql',

  db: secrets.mysql.db,

  mongodb: process.env.MONGODB || secrets.mongodb,

  user: secrets.mysql.user,

  host: secrets.mysql.host,

  password: secrets.mysql.password,

  charset: secrets.mysql.charset,

  sessionSecret: process.env.SESSION_SECRET || secrets.sessionSecret,

  mailgun: {
    login: process.env.MAILGUN_LOGIN || secrets.mailgun.login,
    password: process.env.MAILGUN_PASSWORD || secrets.mailgun.password
  },

  github: {
    clientID: process.env.GITHUB_ID || secrets.github.clientID,
    clientSecret: process.env.GITHUB_SECRET || secrets.github.clientSecret,
    callbackURL: secrets.github.callbackURL,
    passReqToCallback: secrets.github.passReqToCallback
  },

  twitter: {
    consumerKey: process.env.TWITTER_KEY || secrets.twitter.consumerKey,
    consumerSecret: process.env.TWITTER_SECRET  || secrets.twitter.consumerSecret,
    callbackURL: secrets.twitter.callbackURL,
    passReqToCallback: secrets.twitter.passReqToCallback
  },

  google: {
    clientID: process.env.GOOGLE_ID || secrets.google.clientID,
    clientSecret: process.env.GOOGLE_SECRET || secrets.google.clientSecret,
    callbackURL: secrets.google.callbackURL,
    passReqToCallback: secrets.google.passReqToCallback
  },
  widget: secrets.widget || false
};
