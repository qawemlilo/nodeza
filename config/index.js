"use strict";

const config = require('./config.json');
const env = process.env.NODE_ENV || 'development';
const env_vars = require('../.env.js');


module.exports = {
  site: {
    siteName: config.site.siteName || '',
    title: config.site.title || '',
    description: config.site.description || '',
    keywords: config.site.keywords || '',
    twitter_url: config.site.twitter_url || '',
    github_url: config.site.github_url || '',
    port: config.site.port,
    ipAddress: config.site.ipAddress,
    maxAge: config.site.maxAge || 7,
    rssLimit: config.site.rssLimit || 10,
    email: config.site.email,
    baseUrl: config.site.baseUrl,
    activateCSRF: config.site.activateCSRF || true,
    csrfWhitelist: config.site.csrfWhitelist || [],
    sessionSecret: config.site.sessionSecret,
    domain: config.site.domain
  },
  db: {
    client: 'mysql',
    connection: {
      host: env_vars.MYSQL_HOST,
      db: env_vars.MYSQL_DATABASE,
      user: env_vars.MYSQL_USER,
      password: env_vars.MYSQL_PASSWORD,
      charset: "utf8"
    },
    "useNullAsDefault": true
  },
  mailgun: {
    login: env_vars.MAILGUN_USER || config.mailgun.login,
    password: env_vars.MAILGUN_PASSWORD || config.mailgun.password,
    apiKey: env_vars.MAILGUN_KEY || config.mailgun.apiKey,
    email: env_vars.MAILGUN_EMAIL || config.mailgun.email,
    newsletterEmail: env_vars.MAILGUN_NEWSLETTER || config.mailgun.newsletterEmail,
    domain: env_vars.MAILGUN_DOMAIN || config.mailgun.domain
  },
  github: {
    clientID: env_vars.GITHUB_CLIENTID || config.github.clientID,
    clientSecret: env_vars.GITHUB_SECRET || config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    passReqToCallback: config.github.passReqToCallback
  },
  twitter: {
    consumerKey: env_vars.TWITTER_KEY || config.twitter.consumerKey,
    consumerSecret: env_vars.TWITTER_SECRET || config.twitter.consumerSecret,
    accessTokenKey: env_vars.TWITTER_TOKEN_KEY || config.twitter.accessTokenKey,
    accessTokenSecret: env_vars.TWITTER_TOKEN_SECRET || config.twitter.accessTokenSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: config.twitter.passReqToCallback
  },
  google: {
    clientID: env_vars.GOOGLE_CLIENTID || config.google.clientID,
    clientSecret: env_vars.GOOGLE_SECRET || config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: config.google.passReqToCallback
  },
  widget: {
    whitelist: config.widget.whitelist || [],
    cache: true
  },
  blog: {
    postsPerPage: parseInt(config.blog.postsPerPage, 10),
    showAuthor: config.blog.showAuthor,
    showTags: config.blog.showTags,
    showDate: config.blog.showDate,
    showComments: config.blog.showComments || false,
    title: config.blog.title,
    showShareButtons: config.blog.showShareButtons,
    description: config.blog.description
  },
  meetups: {
    meetupsPerPage: parseInt(config.meetups.meetupsPerPage, 10),
    showTags: config.meetups.showTags,
    showDate: config.meetups.showDate,
    title: config.meetups.title,
    showComments: config.meetups.showComments || false,
    description: config.meetups.description || ""
  },
  events: {
    eventsPerPage: config.events.eventsPerPage || 2,
    showTags: config.events.showTags || true,
    showDate: config.events.showDate || true,
    showComments: config.events.showComments || false,
    title: config.events.showComments || "",
    description: config.events.description || ""
  }
};
