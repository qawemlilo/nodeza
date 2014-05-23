
var should = require('chai').should();
var User = require('../models/user');
var Faker = require('Faker');

var Bookshelf  = require('bookshelf');
var secrets = require('../config/secrets');




function createFakeUser() {
  var user = {};

  user.name = Faker.Name.firstName();
  user.email = Faker.Internet.email();
  user.password = 'juliet';

  return user;
}



describe('User', function(){

  beforeEach(function(done){
    Bookshelf.PG = Bookshelf.initialize({
      client: 'mysql',
      connection: {
        host: secrets.host,
        user: secrets.user,
        password: secrets.password,
        database: secrets.db,
        charset: secrets.charset
      }
    });
    done();
  });
  

  var fakeUser = createFakeUser();
  var user = new User();


  describe('#set #save', function() {
    it('should create a new user', function(done){

      user.set(fakeUser);

      user.save()
      .then(function (model) {
         model.get('id').should.above(0);
         model.get('email').should.equal(fakeUser.email);
         done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });


  describe('#set #update', function() {
    it('should update user details', function(done){

      user.set({last_name: 'Mlilo'});

      user.save()
      .then(function (model) {
         model.get('last_name').should.equal('Mlilo');
         done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });


  describe('#destroy', function() {
    it('should delete a user from database', function(done){
      user.destroy()
      .then(function () {
         done();
      })
      .otherwise(function (error) {
        done(error);
      });
    });
  });
});