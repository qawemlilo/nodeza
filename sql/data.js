
var _ = require('lodash');
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
var sequence = require('when/sequence');
var chalk = require('chalk');


module.exports.populateFirst  = function () {
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

  var operations =  [];

  console.log();
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log('\t%s', chalk.yellow('Now populating admin tables with sample content'));
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log();

  _.each(rolesData, function (model) {

    operations.push(function () {
      return Role.forge(model).save().then(function(role) {
        var res = 'Roles entry id: ' + role.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      }); 
    });
  });

  _.each(catsData, function (model) {
    operations.push(function () {
      return Category.forge(model)
      .save()
      .then(function(cat) {
        var res = 'Category entry id: ' + cat.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      }).otherwise(function (err) { console.log(err.message); });
    });
  });

  return sequence(operations);
};



module.exports.populateSecond  = function () {

  var operations =  [];

  console.log();
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log('\t%s', chalk.yellow('Populating databases with sample content'));
  console.log(chalk.yellow('--------------------------------------------------------'));
  console.log();

  _.each(meetupsData, function (model) {

    operations.push(function () {
      return Meetup.forge(model).save().then(function(meetup) {
        var res = 'Meetup entry id: ' + meetup.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      }).otherwise(function (err) { console.log(err.message); }); 
    });
  });

  _.each(eventsData, function (model) {
    operations.push(function () {
      return Event.forge(model).save().then(function(event) {
        var res = 'Events entry id: ' + event.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      }).otherwise(function (err) { console.log(err.message); });
    });
  });

  _.each(postsData, function (model) {
    operations.push(function () {
      return Post.forge().save(model.data, {updateTags: model.tags}).then(function(post) {
        var res = 'Post entry id: ' + post.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      }).otherwise(function (err) { console.log(err.message); });
    });
  });

  _.each(routesData, function (model) {
    operations.push(function () {
      return Route.forge(model).save().then(function(route) {
        var res = 'Routes entry id: ' + route.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      })
      .otherwise(function (err) { 
        console.log(err.message); 
      });
    });
  });

  _.each(menusData, function (model) {
    operations.push(function () {
      return Menu.forge(model).save().then(function(menu) {
        var res = 'Menus entry id: ' + menu.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      })
      .otherwise(function (err) { 
        console.log(err.message); 
      });
    });
  });

  _.each(linksData, function (model) {
    operations.push(function () {
      return Link.forge(model).save().then(function(link) {
        var res = 'Links entry id: ' + link.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      })
      .otherwise(function (err) { 
        console.log(err.message); 
      });
    });
  });

  return sequence(operations);
};

