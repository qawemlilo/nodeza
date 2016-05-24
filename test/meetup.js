"use strict";

const should = require('chai').should();
const app = require('widget-cms');
const Meetup = app.getModel('Meetup');
const meetupsData = require('../sql/data/meetups');



describe('Meetup', function(){

  let meetupData = meetupsData[0];
  let meetup = new Meetup();


  describe('#set #save', function() {
    it('should create a new meetup', function(done){

      meetup.set(meetupData);

      meetup.save()
      .then(function (model) {
        model.get('id').should.above(0);
        model.get('email').should.equal(meetupData.email);
        done();
      })
      .catch(function (error) {
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
      .catch(function (error) {
        done(error);
      });
    });
  });
});
