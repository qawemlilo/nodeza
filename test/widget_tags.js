"use strict";

const should = require('chai').should();
const Tags = require('../widgets/tags');
const App = require('widget-cms');


describe('Tags Widget', function(){

  describe('#exec', function() {
    it('should return widget props with tags collection', function(done){

      Tags.exec(App)
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
