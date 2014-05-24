
var should = require('chai').should();
var User = require('../models/user');

//var Bookshelf  = require('bookshelf');
//var secrets = require('../config/secrets');



describe('Roles', function(){

  describe('#fetch', function() {
    it('should fetch a role from a user', function(done){
      User.forge({email: 'qawemlilo@gmail.com'})
      .fetch({withRelated: ['role']})
      .then(function(user) {
        var role = user.related('role');

        role.get('id').should.equal(1);
        role.get('role').should.equal('Registered');
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});