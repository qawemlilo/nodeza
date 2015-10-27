"use strict";

var _ = require('lodash');
var sequence = require('when/sequence');
var chalk = require('chalk');

var Role = require('../models/roles');
var Category = require('../models/category');
var Event = require('../models/event');
var Meetup = require('../models/meetup');
var Post = require('../models/post');
var Route = require('../models/route');
var Link = require('../models/link');
var Menu = require('../models/menu');

var eventsData = require('./data/events');
var meetupsData = require('./data/meetups');
var postsData = require('./data/posts');
var menusData = require('./data/menus');
var routesData = require('./data/routes');
var linksData = require('./data/links');

var operations =  [];


function unpackCollection (collection) {
  _.each(collection.data, function (data) {
    operations.push(function () {
      var props;

      // if its posts
      if (data.data)
        props = [data.data, {updateTags: data.tags}];
      else
        props = [data, {}];

      return collection.model.forge()
      .save(props[0], props[1])
      .then(function(model) {
        var res = model.tableName + ' entry id: ' + model.get('id') + ' created';
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

  var rolesData = [
    {name: 'Registered'},
    {name: 'Editor'},
    {name: 'Super Administrator'},
    {name: 'Public'}
  ];
  var catsData = [
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
    {model: Event, data: eventsData},
    {model: Post, data: postsData},
    {model: Route, data: routesData},
    {model: Menu, data: menusData},
    {model: Link, data: linksData}
  ], unpackCollection);

  return sequence(operations);
};
