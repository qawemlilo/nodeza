
var should = require('chai').should();
var Meetup = require('../models/meetup');
var meetupsData = require('../sql/data/meetups');



describe('Meetup', function(){

  var meetupData = meetupsData[0];
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