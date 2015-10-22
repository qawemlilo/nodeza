"use strict";

module.exports = {

  mongodb: {
    url: 'mongodb://localhost:27017/nodeza'
  },
  mysql: {
    host: '127.0.0.1',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    charset: 'utf8'
  },
  mailgun: {
    login: 'postmaster@nodeza.co.za',
    password: process.env.MAILGUN_PASS,
    apiKey: process.env.MAILGUN_KEY,
    email: 'info@nodeza.co.za',
    newsletterEmail: 'newsletter@nodeza.co.za"',
    domain: 'nodeza.co.za'
  },
  github: {
    clientID: process.env.GITHUB_CID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "/auth/github/callback",
    passReqToCallback: true
  },
  twitter: {
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: "/auth/twitter/callback",
    passReqToCallback: true
  },
  google: {
    clientID: process.env.GOOGLE_CID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },
  widget: {
    whitelist: ["when", "lodash", "./config.json"],
    cache: true
  }
};
