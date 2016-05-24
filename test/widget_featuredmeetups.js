"use strict";

const should = require('chai').should();
const FeaturedMeetups = require('../widgets/featuredmeetups');
const App = require('widget-cms');


describe('Featured Meetups Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Featured Meetups collection', function(done){

      FeaturedMeetups.exec(App)
      .then(function (collection) {
        collection.length.should.above(0);
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });
});
