"use strict";

const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

function generatePasswordHash(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(5, function(err, salt) {
      if (err) {
        return reject(err);
      }

      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) {
          return reject(err);
        }

        resolve(hash);
      });
    });
  });
}

exports.seed = function(knex, Promise) {
  return Promise.each([
    knex('roles').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('roles').insert({name: 'Registered'}),
        knex('roles').insert({name: 'Editor'}),
        knex('roles').insert({name: 'Super Administrator'}),
        knex('roles').insert({name: 'Public'})
      ]);
    })
    .catch(function (error) {
      console.log(error)
    }),

    knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({name: 'Articles', description: 'General content', slug: 'articles'}),
        knex('categories').insert({name: 'Interviews', description: 'Companies using Node', slug: 'interviews'}),
        knex('categories').insert({name: 'Tutorials', description: 'Node.js Tutorials', slug: 'tutorials'}),
        knex('categories').insert({name: 'News', description: 'Latest Node.js news', slug: 'news'})
      ]);
    })
    .catch(function (error) {
      console.log(error)
    }),

    knex('albums').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('albums').insert({'title':'meetups', slug: 'meetups'}),
        knex('albums').insert({'title':'events', slug: 'events'}),
        knex('albums').insert({'title':'posts', slug: 'posts'})
      ]);
    })
    .catch(function (error) {
      console.log(error)
    }),

    knex('users').del()
    .then(function () {
      return Promise.all([
        generatePasswordHash('admin')
        .then(function (password) {
          return knex('users').insert({
            name: 'admin',
            role_id: 3,
            email: 'admin@nodeza.co.za',
            password: password,
            slug: 'admin'
          });
        })
      ]);
    })
    .catch(function (error) {
      console.log(error)
    }),

    knex('menus').del()
    .then(function () {
      return Promise.all([
        knex('menus').insert({"name": "Main Menu","role_id": 3,"description": "Main Menu"}),
        knex('menus').insert({"name": "Footer Menu","role_id": 1,"description": "Footer Menu"})
      ]);
    }),

    knex('routes').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('routes').insert({"role_id": 4,"path": "/about","http_method": "get","controller_name": "Site","controller_method": "about"}),
        knex('routes').insert({"role_id": 4,"path": "/developers","http_method": "get","controller_name": "Site","controller_method": "developers"}),
        knex('routes').insert({"role_id": 4,"path": "/privacy","http_method": "get","controller_name": "Site","controller_method": "privacy"})
      ]);
    })
    .catch(function (error) {
      console.log(error)
    }),

    knex('links').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('links').insert({
          "route_id": 1,
          "menu_id": 1,
          "parentId": null,
          "inner_text": "About",
          "class_attr": "",
          "id_attr": "",
          "title": "About NodeZA",
          "target": "",
          "icon": "user"
        }),
        knex('links').insert({
          "route_id": 2,
          "menu_id": 1,
          "parentId": null,
          "inner_text": "Developers",
          "class_attr": "",
          "id_attr": "",
          "title": "Developers",
          "target": "",
          "icon": "calendar"
        })
      ]);
    })
    .catch(function (error) {
      console.log(error)
    }),

    knex('meetups').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('meetups').insert({
          "user_id": 1,
          "title": "Node.js Cape Town",
          "short_desc": "We try to meet each month on the third week.",
          "markdown": "Thanks to the brilliant work of Ryan Dahl, we have node.js, a beautiful and elegant server-side framework built on top of Google's V8 Javascript engine. This opens up a whole new world of possibility for developing web apps, APIs, and lightweight HTTP servers.\n\nWe try to meet each month on the third week. Each month we'll have a group discussion on a particular aspect of NodeJS, using it to build apps and any tools or workflows based on it.\n\nIf you'd like to present, please send a note with your topic. If you have a suggestion for a topic, feel free to submit it.\n\nWe are always looking for spaces to use for the meetups. If you'd like to offer a space for us to use, please reach out to us.",
          "province": "Western Cape",
          "image_url": "image_1406633822178.jpeg",
          "organiser": "Johann Detoit",
          "city": "Cape Town",
          "town": "Woodstock",
          "address": "Woodstock, Cape Town, za",
          "lng": "-33.926782",
          "lat": "18.445812",
          "url": "",
          "meetings": "Last week of the month",
          "email": "none@none.com",
          "website": "http://www.meetup.com/nodecpt",
          "slug": "nodejs-cape-town"
        }),
        knex('meetups').insert({
          "user_id": 1,
          "title": "Jozi.Node.JS",
          "image_url": "image_1406633797767.jpg",
          "short_desc": "Come and find out about Node.js the awesome server...",
          "markdown": "Come and find out about Node.js the awesome server side development environment. All welcome.",
          "province": "Gauteng",
          "organiser": "Len Weister",
          "city": "Jozi",
          "town": "Woodstock",
          "address": "44 Stanley Ave, Milpark, Jozi, za",
          "lng": "-33.926782",
          "lat": "18.445812",
          "url": "",
          "meetings": "Last week of the month",
          "email": "none@none.com",
          "website": "http://www.meetup.com/nodecpt",
          "slug": "jozi-node-js"
        })
      ]);
    })
    .catch(function (error) {
      console.log(error)
    }),

    knex('events').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('events').insert({
          "user_id": 1,
          "title": "Software meets hardware : bling a bot not a DIV",
          "short_desc": "In this session we will escape from our beloved...",
          "markdown": "In this session we will escape from our beloved browser and start moving things in the real world. Use your hard earned Node skills to start planning your escape to the Internet of things. We'll start simple you'll be tasked to pimp a bot add some bling and beep. Then it's up to you and your team to complete a few challenges with your blinged up bot.",
          "dt": "2014-08-25",
          "start_time": "18:30:00",
          "finish_time": "",
          "province": "Western Cape",
          "city": "Cape Town",
          "town": "Woodstock",
          "address": "4th Floor, Woodstock Industrial Centre, 66 Albert Road, Cape Town, za",
          "lng": "-33.926782",
          "lat": "18.445812",
          "email": "none@none.com",
          "slug": "software-meets-hardware-bling-a-bot-not-a-div"
        }),
        knex('events').insert({
          "user_id": 1,
          "title": "Intro to PCI-DSS, its importance and how you can become compliant",
          "short_desc": "Peach Payments and Ian Petzer will be giving us...",
          "markdown": "Peach Payments and Ian Petzer will be giving us a intro into integrating online Card Payments into your NodeJS app and discussing what the current landscape for PCI compliance in South-Africa looks like.",
          "dt": "2014-03-25",
          "start_time": "18:30:00",
          "finish_time": "",
          "province": "Western Cape",
          "city": "Cape Town",
          "town": "Woodstock",
          "address": "4th Floor, Woodstock Industrial Centre, 66 Albert Road, Cape Town, za",
          "lng": "-33.926782",
          "lat": "18.445812",
          "email": "none@none.com",
          "slug": "intro-importanc-and-how-you-can-become-compliant"
        })
      ]);
    })
    .catch(function (error) {
      console.log(error)
    })
  ], function (results) {
    return results;
  });
};
