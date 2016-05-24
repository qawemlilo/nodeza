"use strict";

const should = require('chai').should();
const FeaturedEvents = require('../widgets/featuredevents');
const App = require('widget-cms');


describe('Featured Events Widget', function(){

  describe('#exec', function() {
    it('should return widget props with Featured Events collection', function(done){

      FeaturedEvents.exec(App)
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
