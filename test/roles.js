
var should = require('chai').should();
var User = require('../models/user');



describe('Roles', function(){

  describe('#fetch', function() {
    it('should fetch a role from a user', function(done){
      User.forge({id: 1})
      .fetch({withRelated: ['role']})
      .then(function(user) {
        var role = user.related('role');

        role.get('id').should.equal(3);
        role.get('name').should.equal('Super Administrator');
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});