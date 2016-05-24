"use strict";

const should = require('chai').should();
const app = require('widget-cms');
const User = app.getModel('User');


function createFakeUser() {
  let user = {};

  user.name = 'John Doe';
  user.email = 'user_' + Date.now() + '@none.com';
  user.password = 'juliet';
  user.role_id = 1;

  return user;
}


describe('User', function(){

  let fakeUser = createFakeUser();

  describe('#forge #save', function() {
    it('should create a new user', function(done){
      User.forge(fakeUser)
      .save()
      .then(function(model) {
        model.get('id').should.above(0);
        model.get('email').should.equal(fakeUser.email);
        done();
      })
      .catch(function (err) {
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
        .catch(function (error) {
          done(error);
        });
      })
      .catch(function (error) {
        done(error);
      });
    });
  });


  describe('#update', function() {
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
        .catch(function (error) {
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
      .catch(function (error) {
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
      .catch(function (error) {
        done(error);
      });
    });
  });
});
