
var _ = require('lodash');
var Role = require('../models/roles');
var Category = require('../models/category');
var Event = require('../models/event');
var Meetup = require('../models/meetup');
var Post = require('../models/post');
var eventsData = require('./events');
var meetupsData = require('./meetups');
var postsData = require('./posts');
var sequence = require('when/sequence');
var chalk = require('chalk');


module.exports.populate  = function () {
  var rolesData = [
    {name: 'Registered'}, 
    {name: 'Publisher'}, 
    {name: 'Super Administrator'}
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
  console.log('\t%s', chalk.yellow('Now populating databases with sample content'));
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

  return sequence(operations);
};

