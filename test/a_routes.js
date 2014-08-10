
var request = require('supertest');
var app = require('../app');
var user = require('../models/user');


describe('Routes', function(){
  var server;

  before(function (done) {
    app.init(3002);
    server = app.server;

    user.forge({id: 1})
    .fetch({withRelated: ['role', 'tokens']})
    .then(function (model) {
      app.user = model;
      done();
    });
  });


  describe('GET /random-url', function() {
    it('should return 404', function(done) {
      request(server)
        .get('/random-url')
        .expect(404, done);
    });
  });
  
  
  
  describe('GET /login', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/login')
        .expect(200, done);
    });
  });
  
  
  describe('GET /forgot', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/forgot')
        .expect(200, done);
    });
  });
  
  
  describe('GET /signup', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/signup')
        .expect(200, done);
    });
  });
  
  
  describe('GET /account', function() {
    it('should redirect to login and return 302', function(done) {
      request(server)
        .get('/account')
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, resp) {
          if (err) return done(err);
          done();
        });
    });
  });
  
  
  describe('GET /events', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/events')
        .expect(200, done);
    });
  });
  
  describe('GET /blog', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/blog')
        .expect(200, done);
    });
  });
  
  
  describe('GET /meetups', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/meetups')
        .expect(200, done);
    });
  });
  
  describe('GET /', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });
});