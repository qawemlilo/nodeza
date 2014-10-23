"use strict";

var secrets = require('./secrets.json');



module.exports = {
  site: {
    siteName: secrets.site.siteName || '',
    title: secrets.site.title || '',
    description: secrets.site.description || '',
    keywords: secrets.site.keywords || '',
    twitter_url: secrets.site.twitter_url || '',
    github_url: secrets.site.github_url || '',
    port: process.env.OPENSHIFT_NODEJS_PORT || secrets.site.port,
    ipAddress: process.env.NODEJS_IP || secrets.site.ipAddress,
    maxAge: secrets.site.maxAge || 7,
    rssLimit: secrets.site.rssLimit || 10,
    email: secrets.site.email,
    baseUrl: secrets.site.baseUrl,
    activateCSRF: secrets.site.activateCSRF || true,
    csrfWhitelist: secrets.site.csrfWhitelist || [],
    sessionSecret: process.env.SESSION_SECRET || secrets.site.sessionSecret,
    domain: process.env.DOMAIN || 'localhost:300'
  },
  mongodb: {
    url: process.env.MONGODB || secrets.mongodb.url
  },
  mysql: {
    host: process.env.MYSQL_HOST || secrets.mysql.host,
    port: process.env.MYSQL_PORT || null,
    user: process.env.MYSQL_USER || secrets.mysql.user,
    password: process.env.MYSQL_PASSWORD || secrets.mysql.password,
    database: process.env.MYSQL_DB || secrets.mysql.database,
    charset: secrets.mysql.charset || 'utf8'
  },
  mailgun: {
    login: process.env.MAILGUN_LOGIN || secrets.mailgun.login,
    password: process.env.MAILGUN_PASSWORD || secrets.mailgun.password,
    apiKey: process.env.MAILGUN_API_KEY || secrets.mailgun.apiKey,
    email: process.env.MAILGUN_EMAIL || secrets.mailgun.email,
    newsletterEmail: process.env.MAILGUN_NEWSLETTER_EMAIL || secrets.mailgun.newsletterEmail,
    domain: process.env.DOMAIN || secrets.mailgun.domain
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
    showComments: secrets.blog.showComments || false,
    title: secrets.blog.title,
    showShareButtons: secrets.blog.showShareButtons,
    description: secrets.blog.description
  },
  meetups: {
    meetupsPerPage: parseInt(secrets.meetups.meetupsPerPage, 10),
    showTags: secrets.meetups.showTags,
    showDate: secrets.meetups.showDate,
    title: secrets.meetups.title,
    showComments: secrets.meetups.showComments || false,
    description: secrets.meetups.description || ""
  },
  events: {
    eventsPerPage: secrets.events.eventsPerPage || 2,
    showTags: secrets.events.showTags || true,
    showDate: secrets.events.showDate || true,
    showComments: secrets.events.showComments || false,
    title: secrets.events.showComments || "",
    description: secrets.events.description || ""
  }
};
