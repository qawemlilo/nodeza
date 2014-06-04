
var _ = require('lodash');
var Role = require('../models/roles');
var Event = require('../models/event');
var Meetup = require('../models/meetup');
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

  meetupData.user_id = 16;
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

  total = total || 100;

  for(i = 0; i < total; i++) {
    events.push(fakeEvent());
  }

  return events;
}




module.exports.populate  = function () {
  var rolesData = [
    {role: 'Registered'}, 
    {role: 'Publisher'}, 
    {role: 'Super Administrator'}
  ];
  var fakeMeetups = [];
  var fakeEvents = createFakeEvents(100);
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


  _.each(fakeMeetups, function (model) {

    operations.push(function () {
      return Meetup.forge(model).save().then(function(role) {
        var res = 'Meetup entry id: ' + role.get('id') + ' created';
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
