"use strict";

const should = require('chai').should();
const app = require('widget-cms');
const Users = app.getCollection('Users');



describe('Users', function(){

  describe('#fetch', function() {
    it('should fetch all users', function(done){
      let users = new Users();

      users.fetch()
      .then(function(collection) {
        collection.length.should.above(0);
        done();
      })
      .catch(function (err) {
        done(err);
      });
    });
  });
});
