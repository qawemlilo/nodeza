
var should = require('chai').should();
var Meetup = require('../models/meetup');
var Faker = require('Faker');



function createFakeEvent() {
  var meetupData = {};

  meetupData.user_id = 16;
  meetupData.name = Faker.Lorem.sentence().split(',').join(' ');
  meetupData.organiser = 'Qawelesizwe';
  meetupData.short_desc = Faker.Lorem.sentence().split(',').join(' ');
  meetupData.desc = Faker.Lorem.paragraph().split(',').join(' ');
  meetupData.meetings = "Last week of the month";
  meetupData.province = Faker.Address.usState();
  meetupData.lat = Faker.Address.latitude();
  meetupData.lng = Faker.Address.longitude();
  meetupData.city = Faker.Address.city();
  meetupData.town = Faker.Address.city();
  meetupData.address = Faker.Address.streetAddress().split(',').join(' ');
  meetupData.url = Faker.Internet.domainName();
  meetupData.website = Faker.Internet.domainName();
  meetupData.views = 0;
  meetupData.email = Faker.Internet.email();
  meetupData.number = 0743853765;

  return meetupData;
}


describe('Meetup', function(){

  var meetupData = createFakeEvent();
  var meetup = new Meetup();


  describe('#set #save', function() {
    it('should create a new meetup', function(done){

      meetup.set(meetupData);

      meetup.save()
      .then(function (model) {
         model.get('id').should.above(0);
         model.get('email').should.equal(meetupData.email);
         done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });


  describe('#destroy', function() {
    it('should delete a meetup from database', function(done){
      meetup.destroy()
      .then(function () {
         done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});