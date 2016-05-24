"use strict";

const should = require('chai').should();
const App = require('widget-cms');
const Categories = require('../widgets/categories');



describe('Categories Widget', function(){

  describe('#exec', function() {
    it('should return widget props with categories collection', function(done){

      Categories.exec(App)
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
