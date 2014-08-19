
var secrets = require('./secrets.json');

module.exports = {

  site: {
    siteName: secrets.site.siteName || '',
    title: secrets.site.title || '',
    description: secrets.site.description || '',
    keywords: secrets.site.keywords || '',
    twitter_url: secrets.site.twitter_url || '',
    github_url: secrets.site.github_url || '',
    port: secrets.site.port || 3000,
    maxAge: secrets.site.maxAge || 7,
    email: secrets.site.email,
    activateCSRF: secrets.site.activateCSRF || true,
    csrfWhitelist: secrets.site.csrfWhitelist || [],
    sessionSecret: process.env.SESSION_SECRET || secrets.site.sessionSecret
  },
  mongodb: {
    url: process.env.MONGODB || secrets.mongodb.url
  },
  mysql: {
    client: 'mysql',
    db: secrets.mysql.db,
    user: secrets.mysql.user,
    host: secrets.mysql.host,
    password: secrets.mysql.password,
    charset: secrets.mysql.charset
  },
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
  widget: {
    whitelist: secrets.widget.whitelist || [],
    cache: true
  }
};
