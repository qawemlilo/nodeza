
var should = require('chai').should();
var Users = require('../collections/users');




describe('Users', function(){

  describe('#fetch', function() {
    it('should fetch all users', function(done){
      var users = new Users();

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
