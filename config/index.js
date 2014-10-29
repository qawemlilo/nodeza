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
    port: secrets.site.port,
    ipAddress: secrets.site.ipAddress,
    maxAge: secrets.site.maxAge || 7,
    rssLimit: secrets.site.rssLimit || 10,
    email: secrets.site.email,
    baseUrl: secrets.site.baseUrl,
    activateCSRF: secrets.site.activateCSRF || true,
    csrfWhitelist: secrets.site.csrfWhitelist || [],
    sessionSecret: secrets.site.sessionSecret,
    domain: secrets.site.domain
  },
  mongodb: {
    url: secrets.mongodb.url
  },
  mysql: {
    host: secrets.mysql.host,
    port: null,
    user: secrets.mysql.user,
    password: secrets.mysql.password,
    database: secrets.mysql.database,
    charset: secrets.mysql.charset || 'utf8'
  },
  mailgun: {
    login: secrets.mailgun.login,
    password: secrets.mailgun.password,
    apiKey: secrets.mailgun.apiKey,
    email: secrets.mailgun.email,
    newsletterEmail: secrets.mailgun.newsletterEmail,
    domain: secrets.mailgun.domain
  },
  github: {
    clientID: secrets.github.clientID,
    clientSecret: secrets.github.clientSecret,
    callbackURL: secrets.github.callbackURL,
    passReqToCallback: secrets.github.passReqToCallback
  },
  twitter: {
    consumerKey: secrets.twitter.consumerKey,
    consumerSecret: secrets.twitter.consumerSecret,
    callbackURL: secrets.twitter.callbackURL,
    passReqToCallback: secrets.twitter.passReqToCallback
  },
  google: {
    clientID: secrets.google.clientID,
    clientSecret: secrets.google.clientSecret,
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
