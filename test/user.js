
var should = require('chai').should();
var User = require('../models/user');



function createFakeUser() {
  var user = {};

  user.name = 'John Doe';
  user.email = 'john@none.com';
  user.password = 'juliet';

  return user;
}


describe('User', function(){

  var fakeUser = createFakeUser();

  describe('#set #save', function() {
    it('should create a new user', function(done){
      User.forge(fakeUser)
      .save()
      .then(function(model) {
        model.get('id').should.above(0);
        model.get('email').should.equal(fakeUser.email);
        done();
      })
      .otherwise(function (err) {
        done(err);
      });
    });
  });


  describe('#fetch #comparePassword', function() {
    it('should update user details', function(done){
      User.forge({email: fakeUser.email})
      .fetch()
      .then(function (model) {
        model.comparePassword(fakeUser.password)
        .then(function (isMatch) {
          isMatch.should.equal(true);
          model.get('id').should.above(0);
          model.get('email').should.equal(fakeUser.email);
          done();
        })
        .otherwise(function (error) {
          done(error);
        });
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });


  describe('#set #update', function() {
    it('should update user details', function(done){
      User.forge({email: fakeUser.email})
      .fetch()
      .then(function (model) {
        model.set({last_name: 'Mlilo'});
        model.save()
        .then(function (user) {
          user.get('last_name').should.equal('Mlilo');
          done();
        })
        .otherwise(function (error) {
          done(error);
        });
      });
    });
  });


  describe('#gravatar', function() {
    it('should return gravatar  url', function(done){
      User.forge({email: fakeUser.email})
      .fetch()
      .then(function (model) {
        model.gravatar().should.contain('gravatar.com');
        done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });


  describe('#destroy', function() {
    it('should delete a user from database', function(done){
      User.forge({email: fakeUser.email})
      .fetch()
      .then(function (model) {
        model.destroy()
        .then(function () {
          done();
        });
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});