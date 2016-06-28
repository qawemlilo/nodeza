"use strict";

const _ = require('lodash');
const sequence = require('when/sequence');
const chalk = require('chalk');
const config = require('../config');
const App = require('widget-cms');
const path = require('path');

App.config({
  port: 3002,

  secret: 'hjhadsas',

  db: {
    client: 'mysql',
    connection: config.mysql,
    useNullAsDefault: true
  },

  modelsDir: path.resolve('../', 'models'),

  collectionsDir: path.resolve('../', 'collections')
});

App.start();

const Role = App.getModel('Role');
const Category = App.getModel('Category');
const nodeEvent = App.getModel('Event');
const Meetup = App.getModel('Meetup');
const Post = App.getModel('Post');
const Route = App.getModel('Role');
const Link = App.getModel('Link');
const Menu = App.getModel('Menu');

const eventsData = require('./data/events');
const meetupsData = require('./data/meetups');
const postsData = require('./data/posts');
const menusData = require('./data/menus');
const routesData = require('./data/routes');
const linksData = require('./data/links');

let operations =  [];


function unpackCollection (collection) {
  _.each(collection.data, function (data) {
    operations.push(function () {
      let props;

      // if its posts
      if (data.data) {
        props = [data.data, {updateTags: data.tags}];
      }
      else {
        props = [data, {}];
      }

      return collection.model.forge()
      .save(props[0], props[1])
      .then(function(model) {
        let res = model.tableName + ' entry id: ' + model.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      })
      .catch(function (err) {
        console.log(err.message);
      });
    });
  });
}


module.exports.firstBatch  = function () {
  // reset operations
  operations =  [];

  let rolesData = [
    {name: 'Registered'},
    {name: 'Editor'},
    {name: 'Super Administrator'},
    {name: 'Public'}
  ];
  let catsData = [
    {name: 'Articles', description: 'General content'},
    {name: 'Interviews', description: 'Companies using Node'},
    {name: 'Tutorials', description: 'Node.js Tutorials'},
    {name: 'News', description: 'Latest Node.js news'}
  ];

  console.log();
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log('\t%s', chalk.yellow('Now populating admin tables with sample content'));
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log();

  _.each([
    {model: Role, data: rolesData},
    {model: Category, data: catsData}
  ], unpackCollection);

  return sequence(operations);
};


module.exports.secondBatch  = function () {
  // reset operations
  operations =  [];

  console.log();
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log('\t%s', chalk.yellow('Populating databases with sample content'));
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log();

  _.each([
    {model: Meetup, data: meetupsData},
    {model: nodeEvent, data: eventsData},
    {model: Post, data: postsData},
    {model: Route, data: routesData},
    {model: Menu, data: menusData},
    {model: Link, data: linksData}
  ], unpackCollection);

  return sequence(operations);
};
