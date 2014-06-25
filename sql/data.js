
var _ = require('lodash');
var Role = require('../models/roles');
var Category = require('../models/category');
var Event = require('../models/event');
var Meetup = require('../models/meetup');
var Post = require('../models/post');
var Faker = require('Faker');
var sequence = require('when/sequence');
var chalk = require('chalk');



function fakeEvent() {
  var eventData = {};
  var dateTime = Faker.Date.future(10);

  var start_time = dateTime.substring(11, 19);
  var date = dateTime.substring(0, 10);

  eventData.user_id = 16;
  eventData.title = Faker.random.catch_phrase_adjective() + ' ' + Faker.random.catch_phrase_descriptor() + ' ' + Faker.random.catch_phrase_noun() + ' ' + Faker.random.bs_buzz() + ' ' + Faker.random.catch_phrase_descriptor();
  eventData.desc = Faker.Lorem.paragraph().replace(/,/g, ';');
  eventData.dt = date;
  eventData.start_time = start_time;
  eventData.province = Faker.Address.usState();
  eventData.city = Faker.Address.city();
  eventData.town = Faker.Address.city();
  eventData.address = Faker.Address.streetAddress().split(',').join(' ');
  eventData.website = 'http://www.' + Faker.Internet.domainName();
  eventData.url = 'http://www.' + Faker.Internet.domainName();
  eventData.email = Faker.Internet.email();
  eventData.number = Faker.PhoneNumber.phoneNumberFormat(0);
  eventData.views = 0;

  return eventData;
}




function fakeMeetup(opts) {
  var meetupData = {};

  meetupData.user_id = 1;
  meetupData.name = opts.name;
  meetupData.desc = Faker.Lorem.paragraph().replace(/,/g, ';');
  meetupData.short_desc = Faker.Lorem.sentence().replace(/,/g, ';');
  meetupData.organiser= Faker.Name.firstName();
  meetupData.meetings = 'First week of the month';
  meetupData.province = Faker.Address.usState();
  meetupData.city = Faker.Address.city();
  meetupData.town = Faker.Address.city();
  meetupData.lat = Faker.Address.latitude();
  meetupData.lng = Faker.Address.longitude();
  meetupData.address = Faker.Address.streetAddress().split(',').join(' ');
  meetupData.website = 'http://www.' + Faker.Internet.domainName();
  meetupData.url = 'http://www.' + Faker.Internet.domainName();
  meetupData.email = Faker.Internet.email();
  meetupData.number = Faker.PhoneNumber.phoneNumberFormat(0);
  meetupData.views = 0;

  return meetupData;
}


function createFakeEvents (total) {
  var events = [];
  var i;

  total = total || 10;

  for(i = 0; i < total; i++) {
    events.push(fakeEvent());
  }

  return events;
}

var intoPost = 'NodeZA, pronounced as Node Z A, is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js developers under one roof and promote Node as a technology.\n';
intoPost += 'NodeZA is a portal for Node.js developers in South Africa. It was created out of the need to connect Node.js deveoplers under one roof and promote Node as a technology.';


module.exports.populate  = function () {
  var rolesData = [
    {role: 'Registered'}, 
    {role: 'Publisher'}, 
    {role: 'Super Administrator'}
  ];
  var catsData = [
    {name: 'Articles'}, 
    {name: 'Interviews'},
    {name: 'Tutorials'}, 
    {name: 'Company Profiles'}
  ];
  var fakeMeetups = [];
  var fakeEvents = createFakeEvents();
  var operations =  [];

  fakeMeetups.push(fakeMeetup({name: 'Node.js Cape Town'}));
  fakeMeetups.push(fakeMeetup({name: 'Jozi.Node.JS'}));

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
      return Category.forge(model).save().then(function(cat) {
        var res = 'Category entry id: ' + cat.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      }); 
    });
  });

  _.each(fakeMeetups, function (model) {

    operations.push(function () {
      return Meetup.forge(model).save().then(function(meetup) {
        var res = 'Meetup entry id: ' + meetup.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      }).otherwise(function (err) { throw err;}); 
    });
  });

  _.each(fakeEvents, function (model) {
    operations.push(function () {
      return Event.forge(model).save().then(function(event) {
        var res = 'Events entry id: ' + event.get('id') + ' created';
        console.log(chalk.green(' > ') + res);
        return res;
      });
    });
  });

  return sequence(operations);
};




module.exports.addPost = function (id) {
  var blogData = {
    title: 'Welcome to NodeZA',
    category_id: 1,
    user_id: id,
    views: 0,
    meta_title: 'Welcome to NodeZA, a portal of Node.js developers in South Africa',
    meta_description: 'NodeZA is a community of Node.js developers in South Africa',
    markdown: intoPost,
    published: 0,
    featured: 0
  };

  var post = new Post();

  post.tags = 'demo, nodeza';
  post.set(blogData);

  return post.save().then(function(model) {
    var res = 'Default blog post created';
    console.log(chalk.green(' > ') + res);
    console.log('');
    return res;
  });
};
