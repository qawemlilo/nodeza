"use strict";

const should = require('chai').should();
const app = require('widget-cms');
const User = app.getModel('User');

describe('Roles', function(){

  describe('#fetch', function() {
    it('should fetch a role from a user', function(done){
      User.forge({id: 1})
      .fetch({withRelated: ['role']})
      .then(function(user) {
        let role = user.related('role');

        role.get('id').should.equal(3);
        role.get('name').should.equal('Super Administrator');
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });
  });
});
