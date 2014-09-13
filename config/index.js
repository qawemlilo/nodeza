"use strict";

var secrets = require('./secrets.json');

function createMongDB(connection_string) {
  // if OPENSHIFT env variables are present, use the available connection info:
  if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
  }

  return connection_string;
}

module.exports = {

  site: {
    siteName: secrets.site.siteName || '',
    title: secrets.site.title || '',
    description: secrets.site.description || '',
    keywords: secrets.site.keywords || '',
    twitter_url: secrets.site.twitter_url || '',
    github_url: secrets.site.github_url || '',
    port: process.env.OPENSHIFT_NODEJS_PORT || secrets.site.port,
    ipAddress: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    maxAge: secrets.site.maxAge || 7,
    rssLimit: secrets.site.rssLimit || 10,
    email: secrets.site.email,
    baseUrl: secrets.site.baseUrl,
    activateCSRF: secrets.site.activateCSRF || true,
    csrfWhitelist: secrets.site.csrfWhitelist || [],
    sessionSecret: process.env.SESSION_SECRET || secrets.site.sessionSecret
  },
  mongodb: {
    url: createMongDB(secrets.mongodb.url)
  },
  mysql: {
    host: process.env.OPENSHIFT_MYSQL_DB_HOST || secrets.mysql.host,
    port: process.env.OPENSHIFT_MYSQL_DB_PORT || null,
    user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || secrets.mysql.user,
    password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || secrets.mysql.password,
    database: process.env.OPENSHIFT_APP_NAME || secrets.mysql.database,
    charset: secrets.mysql.charset || 'utf8'
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
  },
  blog: {
    postsPerPage: parseInt(secrets.blog.postsPerPage, 10),
    showAuthor: secrets.blog.showAuthor,
    showTags: secrets.blog.showTags,
    showDate: secrets.blog.showDate,
    title: secrets.blog.title,
    showShareButtons: secrets.blog.showShareButtons,
    description: secrets.blog.description
  },
  meetups: {
    meetupsPerPage: parseInt(secrets.meetups.meetupsPerPage, 10),
    showTags: secrets.meetups.showTags,
    showDate: secrets.meetups.showDate,
    title: secrets.meetups.title,
    description: secrets.meetups.description
  }
};
