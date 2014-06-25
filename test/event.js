
var should = require('chai').should();
var Event = require('../models/event');
var Faker = require('Faker');
var moment = require('moment');



function createFakeEvent() {
  var eventData = {};
  var dateTime = Faker.Date.future(10);

  var start_time = dateTime.substring(11, 19);
  var date = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30));

  eventData.user_id = 16;
  eventData.title = Faker.Lorem.sentence().split(',').join(' ');
  eventData.desc = Faker.Lorem.sentence().split(',').join(' ');
  eventData.dt = date;
  eventData.start_time = start_time;
  eventData.province = Faker.Address.usState();
  eventData.city = Faker.Address.city();
  eventData.town = Faker.Address.city();
  eventData.address = Faker.Address.streetAddress().split(',').join(' ');
  eventData.url = Faker.Internet.domainName();
  eventData.email = Faker.Internet.email();
  eventData.number = 0743853765;

  return eventData;
}


describe('Event', function(){

  var eventData = createFakeEvent();
  var event = new Event();


  describe('#set #save', function() {
    it('should create a new event', function(done){

      event.set(eventData);

      event.save()
      .then(function (model) {
         model.get('id').should.above(0);
         model.get('email').should.equal(eventData.email);
         done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });


  describe('#isUpComing', function() {
    it('should be true', function(){
      event.isUpComing().should.be.equal(true);
    });
  });


  describe('#parseDate', function() {
    it('should match dates', function(){
      var dt = event.parseDate('YYYY-MM-DD');
      var dt2 = moment(event.get('dt')).format('YYYY-MM-DD');

      dt.should.be.equal(dt2);
    });
  });


  describe('#parseTime', function() {
    it('should match times', function(){
      var ts = event.parseTime();
      var ts2 = moment(event.get('start_time'), 'HH:mm:ss').format('HH:mm');

      ts.should.be.equal(ts2);
    });
  });


  describe('#destroy', function() {
    it('should delete a user from database', function(done){
      event.destroy()
      .then(function () {
         done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});